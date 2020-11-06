import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCurrentlyReviewedStudent, setActiveUiScreenMode} from "../../../app/store/appReducer";
import {UI_SCREEN_MODES} from "../../../app/constants";
import LoadingIndicator from "../../../app/assets/LoadingIndicator";
import {Col, Container, Row} from "react-bootstrap";

function HomeworksNavPane() {
	const dispatch = useDispatch();
	const activeHomeworkId = useSelector(state => state.app.activeHomeworkId);
	const homeworks = useSelector(state => state.app.homeworks);

	function handleNavigateToHomework(homeworkId) {
		const activeHomeworkData = homeworks.find(h => h.id === homeworkId);
		dispatch(setCurrentlyReviewedStudent(homeworkId));

		if (activeHomeworkData.submittedOnDate) {
			dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.reviewHomework));
		} else {
			dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.editHomework));
		}
	}

	return (
		<Container className="nav-pane rounded-left p-0 xbg-light h-100">
			<Row className='xbg-med rounded-top-left m-0 p-0'>
				<Col className='p-3'>
					<span className='text-left xt-very-large xtext-contrast align-middle'>Your Current Homework</span>
				</Col>
			</Row>
			<Row className='xbg-dark m-0'>
				<Col className='xtext-med xt-small p-1 pl-3'>
					<span className='xtext-contrast'>name | cohort | due date</span>
				</Col>
			</Row>
			<Row className='m-0 p-0'>
				<Col className='xtext-darkest p-2 pb-5 pr-0'>
					{!homeworks && !homeworks.length && <LoadingIndicator className='p-4 text-center h-100 align-middle' loadingMsg={'Loading Homework'} size={3} />}
					{homeworks.map(homework => (
						<div key={homework.id} className={`nav-link ${homework.id === activeHomeworkId ? 'active-selection' : ''}`}
							onClick={() => handleNavigateToHomework(homework.id)} >
							{homework.assignment.title}
						</div>
					))}
				</Col>
			</Row>
		</Container>
	)
}

export default HomeworksNavPane;