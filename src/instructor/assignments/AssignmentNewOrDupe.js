import React, {Fragment, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {createAssignment as createAssignmentMutation} from '../../graphql/mutations';
import {UI_SCREEN_MODES} from "../../app/constants";
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import "./assignments.scss";

import {Container, Row, Button, Col} from "react-bootstrap";
import {notifyUserOfError} from "../../utils/ErrorHandling";
import {listAssignments} from "../../graphql/queries";
import LoadingIndicator from "../../app/assets/LoadingIndicator";

const emptyAssignment = {
  id: '',
  ownerId: '',
  title: '',
  summary: '',
  image: '',
  isLockedOnSubmission: true,
  lockOnDate: 0,
  quizQuestions: [{
    questionText: 'Question #1',
    answerOptions: ['Answer A'],
    correctAnswerIndex: 0,
    progressPointsForCompleting: 1,
    gradePointsForCorrectAnswer: 10
  }]
};

// TODO: Get rid of assignment lockOnData and isLockedOnSubmission
function AssignmentNavOrDupe() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser)

  const [assignments, setAssignments] = useState([]);
  const [isFetchingAssignments, setIsFetchingAssignments] = useState(true);

  useEffect(() => {
    fetchAssignmentList();
  }, []);


  async function fetchAssignmentList() {
    setIsFetchingAssignments(true);

    try {
      let nextTokenVal = null;
      let allAssignments = [];

      do {
        const assignmentQueryResults = await API.graphql(graphqlOperation(listAssignments,
          {filter:{ownerId:{eq:activeUser.id}},
            nextToken: nextTokenVal
          }));
        nextTokenVal = assignmentQueryResults.data.listAssignments.nextToken;
        allAssignments.push(...assignmentQueryResults.data.listAssignments.items);
      } while (nextTokenVal);

      setAssignments(allAssignments);
      setIsFetchingAssignments(false);
    } catch (error) {
      console.warn(`=====> ERROR when fetching all assignments`, error)
    }
  }



	return (
		<Fragment>
      <Row className={'screen-header-bar xbg-light'}>
        <Col className={'col-9'}><h2>Create New Assignment</h2></Col>
        <Col className={'col-3 text-right'}>
          <Button className={'mr-2'}>Cancel</Button>
          <Button>Save</Button>
        </Col>
      </Row>

      <Container>
        {isFetchingAssignments &&
          <Row>
            <LoadingIndicator className='p-4 text-center h-100 align-middle' isDarkSpinner={true} loadingMsg={'FETCHING DATA'} size={3} />
          </Row>
        }

        {!isFetchingAssignments &&
        <Fragment>
          <Row className={'mt-4 mb-4'}>
            <Col>Create a new assignment by selecting one of the following options:</Col>
          </Row>
          <Row className={'ml-2'}>
            <Col className={'col-6 splitter-right'}>
              <Container className={'pt-4 pl-4 pr-4 h-100'}>
                <Row>
                  <Col>
                    <h3 className={'mt-3 mb-2'}>Start a new assignment</h3>
                    <p>Staring a new assignment will provide you with a blank template to build from.</p>
                  </Col>
                </Row>
              </Container>
            </Col>

            <div className={'vertical-separator'}>
              <h3 className={'spacer-word'}>OR</h3>
            </div>

            <Col className={'col-6'}>
              <Container className={'pt-4 pl-4 pr-4'}>
                <Row>
                  <Col>
                    <h3 className={'mt-3 mb-2'}>Duplicate an assignment</h3>
                    <p>Choose an existing assignment, duplicate it, then customize it.</p>
                    <div className="form-group">
                      <select className="form-control" id="assignmentSelector">
                        {assignments.map(a =>
                          <option>{a.title}</option>
                        )}
                      </select>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

          <Row className={'ml-2'}>
            <Col className={'col-6 splitter-right'}>
              <Container className={'p-4 h-100'}>
                <Row className={'mt-auto'}>
                  <Col className={'xbg-light text-center p-2'}>
                    <Button>[] New Assignment</Button>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col className={'col-6'}>
              <Container className={'p-4'}>
                <Row className={'mt-auto'}>
                  <Col className={'xbg-light text-center p-2'}>
                    <Button>[] Duplicate</Button>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>

        </Fragment>
        }
      </Container>
    </Fragment>
  )
}

export default AssignmentNavOrDupe;