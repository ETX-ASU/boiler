import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setActiveAssignmentId, setActiveHomeworkId, setActiveUiScreenMode} from "../../../app/store/appReducer";
import {UI_SCREEN_MODES} from "../../../app/constants";
import LoadingIndicator from "../../../app/assets/LoadingIndicator";
import {Col, Container, Row} from "react-bootstrap";
import "./NavPaneStyles.scss"

function AssignmentsNavPane() {
	const dispatch = useDispatch();
	const assignments = useSelector(state => state.app.assignments);
	const activeAssignmentId = useSelector(state => state.app.activeAssignmentId)

	function handleCreateAssignmentButton() {
    dispatch(setActiveAssignmentId(null));
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createAssignment));
  }

	function handleNavigateToAssignment(assignmentId, title) {
    dispatch(setActiveAssignmentId(assignmentId));
    dispatch(setActiveHomeworkId(null));
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
  }

	return (
		<Container className="nav-pane rounded-left p-0 xbg-light h-100">
			<Row className='xbg-med rounded-top-left m-0 p-0'>
				<Col className='col-8 p-3'>
					<span className='text-left xt-very-large xtext-contrast align-middle'>Assignments</span>
				</Col>
				<Col className='col-4 align-middle text-right mt-2 p-3'>
					<div className='add-assignment-btn text-center' onClick={handleCreateAssignmentButton}/>
				</Col>
			</Row>
			<Row className='xbg-dark m-0'>
				<Col className='xtext-med xt-small p-1 pl-3'>
					<span className='xtext-contrast'>name | cohort | due date</span>
				</Col>
			</Row>
			<Row className='m-0 p-0'>
				<Col className='xtext-darkest p-2 pb-5 pr-0'>
					{(!assignments || !assignments.length) && <LoadingIndicator className='p-4 text-center h-100 align-middle' loadingMsg={'LOADING ASSIGNMENT'} size={3} />}
					{assignments.map(assignment => (
						<div key={assignment.id} className={`nav-link ${assignment.id === activeAssignmentId ? 'active-selection' : ''}`}
							onClick={() => handleNavigateToAssignment(assignment.id)} >
							{assignment.title}
						</div>
					))}
				</Col>
			</Row>
		</Container>
	)
}

export default AssignmentsNavPane;