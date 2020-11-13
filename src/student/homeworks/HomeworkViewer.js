import React from 'react';
import moment from "moment";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import {Container, Row, Col} from 'react-bootstrap';
import "./homeworks.scss";


function HomeworkViewer(props) {
	const {homework, assignment} = props;


	function generateQuestionAndAnswer(questionNum) {
		return (
			<Row className='mt-4' key={questionNum}>
				<Col className="quiz-question">
					{/*<label>You answered question #{questionNum+1} as follows:</label>*/}
					<legend className='ml-2'>Question #{questionNum+1}. {assignment.quizQuestions[questionNum].questionText}</legend>
					{assignment.quizQuestions[questionNum].answerOptions.map((optText, optNum) =>
						<div key={optNum} className="form-check ml-4">
							{(homework.quizAnswers[questionNum] === optNum) && <span className="selected-indicator">></span>}
							<label className={`form-check-label reviewed-answer ${(homework.quizAnswers[questionNum] === optNum) ? "checked" : ""}`} htmlFor={`q-${questionNum}-opt-${optNum}`}>{optText}</label>
						</div>
					)}
				</Col>
			</Row>
		)
	}

	return (
		<Container className="homework-viewer">
			<Row className='xbg-light p-2'>
				<Col>
					<label>Assignment Title:</label>
					<p className='summary-data xt-med'>{assignment.title}</p>
				</Col>
				<Col>
					<label>Summary:</label>
					<p className='summary-data xt-med'>{assignment.summary}</p>
				</Col>
			</Row>

			{assignment.quizQuestions.map((question, index) => generateQuestionAndAnswer(index) )}

		</Container>
	)
}

export default HomeworkViewer;