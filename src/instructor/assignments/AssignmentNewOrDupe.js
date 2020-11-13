import React, {Fragment, useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {createAssignment as createAssignmentMutation} from '../../graphql/mutations';
import {UI_SCREEN_MODES} from "../../app/constants";
import {editDupedAssignment, setActiveUiScreenMode} from "../../app/store/appReducer";
import "./assignments.scss";

import {Container, Row, Button, Col} from "react-bootstrap";
import {notifyUserOfError} from "../../utils/ErrorHandling";
import {getAssignment, listAssignments} from "../../graphql/queries";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import HeaderBar from "../../app/HeaderBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {library} from "@fortawesome/fontawesome-svg-core";
import { faPlus, faCopy } from '@fortawesome/free-solid-svg-icons'
library.add(faCopy, faPlus);





// TODO: Get rid of assignment lockOnData and isLockedOnSubmission
function AssignmentNavOrDupe() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser);
  const courseId = useSelector(state => state.app.courseId);

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


  async function handleDupeAssignment(e) {
    const selectedId = document.getElementById('assignmentSelector').value;
    const assignmentQueryResults = await API.graphql(graphqlOperation(getAssignment, {id:selectedId}));
    const assignment = assignmentQueryResults.data.getAssignment;
    console.log("Retrieved assignment", assignment);

    const inputData = Object.assign({}, assignment, {title: `Copy of ${assignment.title}`, id: uuid(), ownerId: activeUser.id, courseId, resourceId:'', lockOnDate: 0});
    delete inputData.createdAt;
    delete inputData.updatedAt;
    const result = await API.graphql({query: createAssignmentMutation, variables: {input: inputData}});
    console.log("Created duplicate assignment", result);

    dispatch(editDupedAssignment(result.data.createAssignment));
  }

  function handleCreateAssignment(e) {
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createAssignment));
  }


	return (
		<Fragment>
      <HeaderBar title='Create New Assignment' canCancel={false} canSave={false} >
        <Button disabled className='mr-2'>Cancel</Button>
        <Button disabled>Update</Button>
      </HeaderBar>

      <Container className='m-2'>
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
                        {assignments.map((a,i) =>
                          <option key={i} value={a.id}>{a.title}</option>
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
                    <Button className='align-middle' onClick={handleCreateAssignment}>
                      <FontAwesomeIcon className='btn-icon' icon={faPlus} />
                      New Assignment
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col className={'col-6'}>
              <Container className={'p-4'}>
                <Row className={'mt-auto'}>
                  <Col className={'xbg-light text-center p-2'}>
                    <Button className='align-middle' onClick={handleDupeAssignment}>
                      <FontAwesomeIcon className='btn-icon' icon={faCopy} />
                      Duplicate
                    </Button>
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