import React, {useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Container, Row} from "react-bootstrap";
import moment from "moment";
import {testComments, generateMockMembers, createMockLmsData, deleteMockLmsData} from "../utils/mockRingLeaderAPIs";
import {HOMEWORK_PROGRESS, UI_SCREEN_MODES} from "../app/constants";
import { v4 as uuid } from "uuid";
import {shuffle} from "../utils/shuffle";
import {calcAutoScore} from "../utils/homeworkUtils";
import {createHomework, deleteHomework} from "../graphql/mutations";
import {setActiveUiScreenMode} from "../app/store/appReducer";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {listHomeworks} from "../graphql/queries";



function DevUtilityDashboard(props) {
  const assignment = useSelector(state => state.app.assignment);
  const activeUser = useSelector(state => state.app.activeUser);

  const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const generateRandomClassData = () => {
    return {numGraded:rand(15,25), numSubmitted:rand(25,55), numInProgress:rand(5,25), numNotBegun:rand(5, 10)}
  }

  const [formData, setFormData] = useState(generateRandomClassData());

  async function handleSubmitButton() {
    let {numInProgress, numSubmitted, numNotBegun, numGraded} = formData;
    const totalStudents = numInProgress + numSubmitted + numGraded + numNotBegun;

    const progressStats = shuffle([
      ...Array(numNotBegun).fill(HOMEWORK_PROGRESS.notBegun),
      ...Array(numInProgress).fill(HOMEWORK_PROGRESS.inProgress),
      ...Array(numSubmitted).fill(HOMEWORK_PROGRESS.submitted),
      ...Array(numGraded).fill(HOMEWORK_PROGRESS.fullyGraded),
    ]);

    const mockStudents = generateMockMembers(totalStudents);

    const mockHomeworks = mockStudents.map((s, i) => {
      const progress = progressStats[i];
      let beganOnDate = 0;
      let submittedOnDate = (progress === HOMEWORK_PROGRESS.submitted || HOMEWORK_PROGRESS.fullyGraded) ? moment().valueOf() : 0;
      let quizAnswers = Array(assignment.quizQuestions.length).fill(-1);

      if (progress !== HOMEWORK_PROGRESS.notBegun) {
        beganOnDate = moment().valueOf();
        quizAnswers = assignment.quizQuestions.map(q => rand(0, q.answerOptions.length-1));
        if (progress === HOMEWORK_PROGRESS.inProgress) {
          quizAnswers.pop();
          quizAnswers.push(-1); // partial result so always make last one not started.
        }
      }

      return ({
        id: uuid(),
        assignmentId: assignment.id,
        studentOwnerId: s.id.toString(),
        beganOnDate,
        quizAnswers,
        submittedOnDate,
        isLocked: false,
      })
    })

    const mockGrades = mockHomeworks.map((h, i) => {
      let score = (progressStats[i] !== HOMEWORK_PROGRESS.fullyGraded) ? 0 : calcAutoScore(assignment, h);
      let comment = (progressStats[i] === HOMEWORK_PROGRESS.fullyGraded && !rand(0,3)) ? testComments[rand(0, testComments.length-1)] : '';
      let gradingProgress = (progressStats[i] !== HOMEWORK_PROGRESS.fullyGraded) ? HOMEWORK_PROGRESS.notBegun : HOMEWORK_PROGRESS.fullyGraded;
      return ({ studentId:h.studentOwnerId, score, gradingProgress, comment })
    })

    const dbHomeworks = mockHomeworks.filter(h => h.beganOnDate);
    console.log(`-----> dbHomeworks`, dbHomeworks);

    let results;
    try {
      results = await Promise.all(dbHomeworks.map(h => API.graphql({query: createHomework, variables: {input: h}})));
      createMockLmsData(activeUser.courseId, assignment.id, mockStudents, mockGrades);
    } catch (e) {
      notifyUserOfError(e);
    }
    console.log(`-----> results`, results);
    // dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.reviewHomework));
  }

  async function handleDeleteStudents() {
    deleteMockLmsData(assignment.id, props.courseId);
    console.log(`students and grade data deleted for assignment: ${assignment.id}`);
  }

  async function handleDeleteHomeworks() {
    let results;
    try {
      const fetchHomeworkResult = await API.graphql(graphqlOperation(listHomeworks, {filter: {assignmentId: {eq:assignment.id}}}));
      if (!fetchHomeworkResult.data.listHomeworks.items.length) return;
      results = await Promise.all(fetchHomeworkResult.data.listHomeworks.items.map(h => API.graphql({query: deleteHomework, variables: {input: {id: h.id}}})));
      console.log(`homeworks deleted: `, results);
    } catch (e) {
      notifyUserOfError(e);
    }
  }



	return (
    <Container className='student-dashboard dashboard bg-white rounded h-100 m-4 p-4'>
      <form>

        <Row className='xbg-light'>
          <Col><h3>Generate Students & Homework</h3></Col>
          <Col><Button onClick={handleSubmitButton}>Generate</Button></Col>
        </Row>
        <Row>
          <Col>
            <div className="input-bar lumped-with-next">
              <label># Graded:</label>
              <input type="number" min={0} max={1000} step={5} onChange={e => setFormData({...formData, numGraded: parseInt(e.target.value)})} defaultValue={formData.numGraded}/>
            </div>
          </Col>
          <Col>
            <div className="input-bar lumped-with-next">
              <label># Submitted:</label>
              <input type="number" min={0} max={1000} step={5} onChange={e => setFormData({...formData, numSubmitted: parseInt(e.target.value)})} defaultValue={formData.numSubmitted}/>
            </div>
          </Col>
          <Col>
            <div className="input-bar lumped-with-next">
              <label># InProgress:</label>
              <input type="number" min={0} max={1000} step={5} onChange={e => setFormData({...formData, numInProgress: parseInt(e.target.value)})} defaultValue={formData.numInProgress}/>
            </div>
          </Col>
          <Col>
            <div className="input-bar lumped-with-next">
              <label># Not Begun:</label>
              <input type="number" min={0} max={1000} step={5} onChange={e => setFormData({...formData, numNotBegun: parseInt(e.target.value)})} defaultValue={formData.numNotBegun}/>
            </div>
          </Col>
        </Row>
        <Row className='pt-4 pl-2 pr-2'>
        </Row>

        <Row className='xbg-light'>
          <Col><h3>Clear Students & Homework</h3></Col>
          <Col><Button onClick={handleDeleteHomeworks}>Delete Homeworks</Button></Col>
          <Col><Button onClick={handleDeleteStudents}>Delete Students</Button></Col>
        </Row>

      </form>
    </Container>
	);
}

export default DevUtilityDashboard;
