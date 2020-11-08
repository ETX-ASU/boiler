import React, {useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Container, Row} from "react-bootstrap";
import moment from "moment";
import {testComments, generateMockMembers, createMockLmsData} from "../utils/mockRingLeaderAPIs";
import {HOMEWORK_PROGRESS, UI_SCREEN_MODES} from "../app/constants";
import { v4 as uuid } from "uuid";
import {shuffle} from "../utils/shuffle";
import {calcAutoScore} from "../utils/homeworkUtils";
import {updateHomework as updateHomeworkMutation} from "../graphql/mutations";
import {setActiveUiScreenMode} from "../app/store/appReducer";
import {notifyUserOfError} from "../utils/ErrorHandling";



function DevUtilityDashboard(props) {
  const assignment = useSelector(state => state.app.assignment);

  const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const generateRandomClassData = () => {
    return {numGraded:rand(15,25), numSubmitted:rand(25,55), numInProgress:rand(5,25), numNotBegun:rand(5, 10)}
  }

  const [formData, setFormData] = useState(generateRandomClassData());

  async function handleSubmitButton() {
    let {numInProgress, numSubmitted, numNotBegun, numGraded} = formData;
    const totalStudents = numInProgress + numSubmitted + numGraded + numNotBegun;

    let progressStats = shuffle([
      ...Array(numNotBegun).fill(HOMEWORK_PROGRESS.notBegun),
      ...Array(numInProgress).fill(HOMEWORK_PROGRESS.inProgress),
      ...Array(numSubmitted).fill(HOMEWORK_PROGRESS.submitted),
      ...Array(numGraded).fill(HOMEWORK_PROGRESS.fullyGraded),
    ]);

    let mockStudents = generateMockMembers(totalStudents);
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
      let instructorScore = (progressStats[i] !== HOMEWORK_PROGRESS.fullyGraded) ? 0 : calcAutoScore(assignment, h);
      let comment = (progressStats[i] === HOMEWORK_PROGRESS.fullyGraded && !rand(0,3)) ? testComments[rand(0, testComments.length-1)] : '';
      let gradingProgress = (progressStats[i] !== HOMEWORK_PROGRESS.fullyGraded) ? HOMEWORK_PROGRESS.notBegun : HOMEWORK_PROGRESS.fullyGraded;
      return ({ studentId:h.studentOwnerId, instructorScore, gradingProgress, comment })
    })


    try {
      const inputData = mockHomeworks[0];
      console.log("mockInputData ", mockHomeworks[0]);

      const result = await API.graphql({query: updateHomeworkMutation, variables: {input: inputData}});
      if (!result) throw new Error ("result from updateHomeworkMutation came back null.");
      console.log(`-----> results`, result);
      // await mockHomeworks.map(async h => await API.graphql({query: updateHomeworkMutation, variables: {input: h}}));
      // results = await Promise.all(mockHomeworks.map(h => API.graphql({query: updateHomeworkMutation, variables: {input: h}})));
      createMockLmsData(assignment.id,props.courseId, mockStudents, mockGrades);
    } catch (e) {
      notifyUserOfError(e);
    }
    // console.log(`-----> mockStudents`, mockStudents);
    console.log(`-----> mockHomeworks`, mockHomeworks);
    // console.log(`-----> mockGrades`, mockGrades);
    // dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.reviewHomework));
  }





	return (
    <Container className='student-dashboard dashboard bg-white rounded h-100 m-4 p-4'>
      <form>
        <Row>
          <Col><h3>Generate Homework Results for Assignment</h3></Col>
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
          <Button onClick={handleSubmitButton}>Generate</Button>
        </Row>
      </form>
    </Container>
	);
}

export default DevUtilityDashboard;
