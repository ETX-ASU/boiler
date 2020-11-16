import React, {useState} from 'react';
import LoadingIndicator from "../app/assets/LoadingIndicator";
import {Col, Container, Row, Button} from "react-bootstrap";
import AssignmentListItem from "./AssignmentListItem";
import {API} from "aws-amplify";
import {updateAssignment as updateAssignmentMutation} from "../graphql/mutations";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {setActiveUiScreenMode} from "../app/store/appReducer";
import {UI_SCREEN_MODES} from "../app/constants";
import {createAssignmentInLms} from "../utils/RingLeader";
import $ from "jquery";

function AssignmentsSelectionList(props) {
	const assignments = props.assignments;
  const [activeAssignmentIndex, setActiveAssignmentIndex] = useState(0);

  function handleAssignmentSelected(index) {
    setActiveAssignmentIndex(index);
  }

  async function handleConnectToLMS() {
    const assignment = assignments[activeAssignmentIndex];
    const isConfirmed = window.confirm(`Connecting to Assignment #${activeAssignmentIndex}: ${assignment.title}. Are you sure we should continue?`);
    if (!isConfirmed) return;


    // Add the resourceId to the assignment
    try {
      // const inputData = Object.assign({}, assignment);
      // // inputData.resourceId = resourceId;
      // // delete inputData.createdAt;
      // // delete inputData.updatedAt;

      const resourceDataForLms = {
        type: 'ltiResourceLink',
        label: assignment.title,
        url: '', // leave null
        resourceId: assignment.id,
        lineItem: {
          scoreMaximum: 100,
          label: assignment.title,
          tag: `TAG FOR ${assignment.title}`
        }
      }

      const dataResult = await createAssignmentInLms(resourceDataForLms);

      /*alert(`We received this data from LMS: ${JSON.stringify(dataResult)}`);

      function setInnerHTML(element, content) {
        element.innerHTML = content;
        return element;
      }*/
      $("body").append(dataResult);
      //document.getElementsByTagName('body')[0].appendChild(setInnerHTML(document.createElement("div"), dataResult));

      // await API.graphql({query: updateAssignmentMutation, variables: {input: inputData}});
      // alert(`SUCCESSFUL! Set resourceId = ${resourceId}`);
    } catch (e) {
      notifyUserOfError(e);
    }
  }


	return (
		<Container className="h-100">
      <Row>
        <Col className='w-auto xt-large xtext-dark font-weight-bold'>List of Assignments</Col>
      </Row>
      <Row>
        <Col className="pr-4">
          {props.isFetchingAssignments &&
            <LoadingIndicator className='p-4 text-center h-100 align-middle' isDarkSpinner={true} loadingMsg={'FETCHING STUDENT HOMEWORK'} size={3} />
          }
          {!props.isFetchingAssignments && (assignments.length > 0) &&
            <ul className="list-group w-100">
              {assignments.map((a, rowNum) => (
                <AssignmentListItem key={a.id} rowNum={rowNum+1} assignment={a}
                                    selected={activeAssignmentIndex === rowNum}
                                    disabled={a.resourceId}
                                    clickHandler={(e) => handleAssignmentSelected(rowNum)}/>
              ))}
            </ul>
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