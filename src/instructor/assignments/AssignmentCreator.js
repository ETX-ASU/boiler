import React, {Fragment, useState} from 'react';
import {API} from 'aws-amplify';
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {createAssignment as createAssignmentMutation} from '../../graphql/mutations';
import {UI_SCREEN_MODES} from "../../app/constants";
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import "./assignments.scss";

import {Button} from "react-bootstrap";
import {notifyUserOfError} from "../../utils/ErrorHandling";

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
function AssignmentCreator() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser)
	const [formData, setFormData] = useState(emptyAssignment);

	async function handleSubmitButton() {
		if (!formData.title || !formData.summary) return;

		const assignmentId = uuid();

		// cohortId no longer needed. Association between an assignment and students is managed by LMS.
		const inputData = Object.assign({}, formData, {
			id: assignmentId,
			ownerId: activeUser.id,
			lockOnDate: (formData.isLockedOnDate) ? moment(formData.lockOnDate).valueOf() : 0
		});

		try {
      await API.graphql({query: createAssignmentMutation, variables: {input: inputData}});
    } catch (e) {
		  notifyUserOfError(e);
    }

		// await props.refreshHandler();
		dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
	}


	function handleAddQuestionButton(e) {
		const quizQuestions = formData.quizQuestions;

		console.warn("ADDING QUESTION: ", quizQuestions);
		let newQuestions = quizQuestions.slice();
		newQuestions.push({
			questionPosition: 0,
			questionText: `Question #${quizQuestions.length+1}`,
			answerOptions: ['Answer A'],
			correctAnswerIndex: 0,
			progressPointsForCompleting: 1,
			gradePointsForCorrectAnswer: 10
		});
		setFormData({...formData, quizQuestions:newQuestions})
	}

	function handleQuestionChange(e, qNum, propName) {
		const quizQuestions = formData.quizQuestions;
		quizQuestions[qNum][propName] = e.target.value;
		setFormData({...formData, quizQuestions})
	}

	function handleOptionChange(e, qNum, index) {
		const options = formData.quizQuestions[qNum].answerOptions.slice();
		options[index] = e.target.value;
		if ((!e.target.value) && (index-1 <= formData.quizQuestions.length)) options.splice(index, 1);

		const quizQuestions = formData.quizQuestions;
		quizQuestions[qNum].answerOptions = options;
		setFormData({...formData, quizQuestions})
	}

	function addAnswerOpt(qNum) {
		const newQuizQuestions = formData.quizQuestions.slice();
		newQuizQuestions[qNum].answerOptions = newQuizQuestions[qNum].answerOptions.slice();
		newQuizQuestions[qNum].answerOptions.push("");

		setFormData({...formData, quizQuestions: newQuizQuestions})
	}

	function removeAnswerOpt(qNum) {
		const newQuizQuestions = formData.quizQuestions.slice();
		newQuizQuestions[qNum].answerOptions = newQuizQuestions[qNum].answerOptions.slice();
		if (newQuizQuestions[qNum].answerOptions.length > 1) newQuizQuestions[qNum].answerOptions.pop();
		console.warn("formData", newQuizQuestions);

		setFormData({...formData, quizQuestions:newQuizQuestions})
	}

	function generateQuestionForm(qNum) {
		const qData = formData.quizQuestions[qNum];
		return (
			<Fragment key={qNum}>
				{/* Arbitrary maximum of 3 questions per quiz for this boilerplate.*/}
				{(!qNum && formData.quizQuestions.length < 3) && <div className='add-question-btn text-center' onClick={handleAddQuestionButton} />}
				<h4>The Quiz Question ({qNum+1} of {formData.quizQuestions.length})</h4>

				<div className="quiz-question">
					<div className="input-bar">
						<label>Question Text</label>
						<input onChange={e => handleQuestionChange(e, qNum, 'questionText')} defaultValue={qData.questionText}/>
					</div>

					<div className="input-bar">
						<label>List of possible answers</label>
						<div className="options-list">
							{qData.answerOptions.map((opt, index) =>
								<input key={index} onChange={e => handleOptionChange(e, qNum, index)} defaultValue={opt}/>
							)}
							<div className='add-remove-opts-bar'>
								{/* Arbitrary maximum of 5 answer options per question for this boilerplate.*/}
								<Button className='btn-sm btn-dark add-answer-opt' disabled={(qData.answerOptions.length >= 5 || qData.answerOptions[qData.answerOptions.length-1] === '')} onClick={() => addAnswerOpt(qNum)}> + </Button>
								<Button className="btn-sm btn-dark remove-answer-opt" disabled={qData.answerOptions.length <= 1} onClick={() => removeAnswerOpt(qNum)}> - </Button>
							</div>
						</div>
					</div>

					<div className="input-bar">
						<label>Index of correct answer (0-based)</label>
						<input type="number" min={0} max={10}
									 onChange={e => handleQuestionChange(e, qNum, 'correctAnswerIndex')}
									 defaultValue={qData.correctAnswerIndex}/>
					</div>

					<div className="input-bar">
						<label>Grade points for giving correct answer</label>
						<input type="number" min={0} max={1000}
									 onChange={e => handleQuestionChange(e, qNum, 'gradePointsForCorrectAnswer')}
									 defaultValue={qData.gradePointsForCorrectAnswer}/>
					</div>

					<div className="input-bar">
						<label>Progress points for completing this question</label>
						<input type="number" min={0} max={1000}
									 onChange={e => handleQuestionChange(e, qNum, 'progressPointsForCompleting')}
									 defaultValue={qData.progressPointsForCompleting}/>
					</div>
					<hr/>
				</div>
			</Fragment>
		)
	}

	return (
		<div className="AssignmentCreator">
      <h3>Create a new Quiz Assignment</h3>
			<form className='mt-4 mb-4'>
				<div className="input-bar lumped-with-next">
					<label>Assignment Title:</label>
					<input onChange={e => setFormData({...formData, 'title': e.target.value})}
								 defaultValue={formData.title}/>
				</div>

				<div className="input-bar">
					<label>Assignment Summary:</label>
					<input onChange={e => setFormData({...formData, 'summary': e.target.value})}
								 defaultValue={formData.summary}/>
				</div>

				<div>
					{formData.quizQuestions.map((question, qNum) => generateQuestionForm(qNum))}
				</div>

			</form>

			<button onClick={handleSubmitButton}>SUBMIT</button>
			<br/>
			<br/>
		</div>
	)
}

export default AssignmentCreator;