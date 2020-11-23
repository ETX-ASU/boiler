import React, {useState} from 'react';
import {API} from 'aws-amplify';
import LoadingIndicator from "../app/assets/LoadingIndicator";
import {Col, Container, Row, Button} from "react-bootstrap";
import AssignmentListItem from "./AssignmentListItem";
import {createAssignmentInLms} from "../utils/RingLeader";
import {updateAssignment} from "../graphql/mutations";

// import $ from "jquery";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCopy} from "@fortawesome/free-solid-svg-icons";

function AssignmentsSelectionList(props) {
	const assignments = props.assignments;

  async function handleConnectToLMS() {
    const selectedId = document.getElementById('assignmentSelector').value;
    const assignment = assignments.find(a => a.id === selectedId);

    const resourceDataForLms = {
      type: 'ltiResourceLink',
      label: assignment.title,
      url: '', // leave null
      resourceId: assignment.id,
      lineItem: {
        scoreMaximum: 100,
        label: assignment.title,
        resourceId: assignment.id,
        tag: `TAG FOR ${assignment.title}`
      }
    }

    const inputData = Object.assign({}, assignment, {isLinkedToLms: true});
    delete inputData.createdAt;
    delete inputData.udpatedAt;

    try {
      const updateResult = await API.graphql({query: updateAssignment, variables: {input: inputData}});
      if (!updateResult) throw new Error('could not update link status in tool database');

      //TODO remove query, launch with React.
      const linkToLmsResult = await createAssignmentInLms(resourceDataForLms);
      // $("body").append(linkToLmsResult);
      await document.body.appendChild(linkToLmsResult);
      document.getElementById("ltijs_submit").submit();
    } catch (error) {
      window.confirm(`Sorry. An error occurred while trying to connect and create this assignment within the LMS. Error: ${error}`);
    }
  }

	return (
		<Container className="h-100">
      <Row>
        <Col className='w-auto xt-large xtext-dark font-weight-bold'>
          <h3 className={'mt-3 mb-2'}>Choose which Quiz Assignment to use in your LMS</h3>
        </Col>
      </Row>
      <Row>
        <Col className="pr-4">
          {props.isFetchingAssignments &&
            <LoadingIndicator className='p-4 text-center h-100 align-middle' isDarkSpinner={true} loadingMsg={'FETCHING STUDENT HOMEWORK'} size={3} />
          }
          {!props.isFetchingAssignments && (assignments.length > 0) &&
            <div className="form-group">
              <select className="form-control" id="assignmentSelector">
                {assignments.map((a,i) =>
                  <option key={i} value={a.id}>{a.title}</option>
                )}
              </select>
              <Button className='align-middle' onClick={handleConnectToLMS}>
                Connect this Assignment to LMS
              </Button>
            </div>
          }
          {!props.isFetchingAssignments && (assignments.length < 1) &&
            <p className='mt-4'>You have not created any assignments. You must first create an assignment.</p>
          }
        </Col>
      </Row>
      <Row>
        <Button onClick={handleConnectToLMS}>
          Connect this Assignment to LMS
        </Button>
      </Row>
		</Container>
	)
}

export default AssignmentsSelectionList;