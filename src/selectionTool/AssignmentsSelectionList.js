import React, {useState} from 'react';
import LoadingIndicator from "../app/assets/LoadingIndicator";
import {Col, Container, Row} from "react-bootstrap";
import AssignmentListItem from "./AssignmentListItem";

function AssignmentsSelectionList(props) {
	const assignments = props.assignments;
  const [activeAssignmentIndex, setActiveAssignmentIndex] = useState(0)

  function handleAssignmentSelected(index) {
    console.log(`user selected assignment index #${index}`);
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
                <AssignmentListItem key={a.id} rowNum={rowNum+1} assignment={a} clickHandler={handleAssignmentSelected}/>
              ))}
            </ul>
          }
          {!props.isFetchingAssignments && (assignments.length < 1) &&
            <p className='mt-4'>You have not created any assignments. You must first create an assignment.</p>
          }
        </Col>
      </Row>
		</Container>
	)
}

export default AssignmentsSelectionList;