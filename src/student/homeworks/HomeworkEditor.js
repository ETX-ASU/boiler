import React, {useState} from 'react';
import moment from "moment";
import {useDispatch} from "react-redux";
import {UI_SCREEN_MODES} from "../../app/constants";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import {Button, Container, Row, Col} from 'react-bootstrap';
import {updateHomework as updateHomeworkMutation} from "../../graphql/mutations";
import {API} from "aws-amplify";
import {setActiveUiScreenMode} from "../../app/store/appReducer";

/** This screen is shown to the student so they can "engage" with the homework assignment.
 * Any work they do or changes or interactions they make would be recorded and the updates
 * saved to the database as necessary. */
function HomeworkEditor(props) {
	const dispatch = useDispatch();
	const {homework, assignment} = props;

	const [formData, setFormData] = useState(Object.assign({}, {quizAnswers:homework.quizAnswers}));

	async function handleSubmitButton() {
		const inputData = Object.assign({}, homework, {
			quizAnswers: formData.quizAnswers.slice(),
			beganOnDate: (homework.beganOnDate) ? homework.beganOnDate : moment().valueOf(),
			submittedOnDate: (homework.submittedOnDate) ? homework.submittedOnDate : moment().valueOf()
		});
		delete inputData.assignment;
		delete inputData.createdAt;
		delete inputData.updatedAt;
    delete inputData.score;
    delete inputData.comment;
    delete inputData.homeworkStatus;

		try {
		  console.log('inputData', inputData);
      const result = await API.graphql({query: updateHomeworkMutation, variables: {input: inputData}});
      if (!result) throw new Error ("result from updateHomeworkMutation came back null.");
    } catch (e) {
		  console.warn("Notify student their homework changes were not saved.")
    }
		await props.refreshHandler();
		dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.reviewHomework));
	}


	function handleOptClicked(qNum, optNum) {
		const qAnswers = formData.quizAnswers.slice();
		qAnswers[qNum] = optNum;
		setFormData(Object.assign({}, formData, {quizAnswers: qAnswers}))
	}

	function generateQuestionAndOpts(questionNum) {
		return (
      <Row className='mt-4' key={questionNum}>
				<Col className="quiz-question">
          <legend className='ml-2'>Question #{questionNum+1}. {assignment.quizQuestions[questionNum].questionText}</legend>
					{assignment.quizQuestions[questionNum].answerOptions.map((optText, optNum) =>
						<div key={optNum} className="form-check ml-4">
							<input
								className="form-check-input"
								id={`q-${questionNum}-opt-${optNum}`}
								onChange={() => handleOptClicked(questionNum, optNum)} key={optNum} type="radio"
								name={`questionChoice_${questionNum}`} value={optNum}
								defaultChecked={(homework.quizAnswers[questionNum] === optNum) ? "checked" : ""}
							/>
							<label className="form-check-label" htmlFor={`q-${questionNum}-opt-${optNum}`}>{optText}</label>
						</div>
					)}
				</Col>
			</Row>
		)
	}

	return (
		<Container className="homework-viewer">
			<form>
        <Row className='xbg-light p-2'>
          <Col>
            <label>Assignment Title:</label>
            <p className='summary-data xt-med'>{assignment.title}</p>
          </Col>
          <Col>
            <label>Homework Summary:</label>
            <p className='summary-data xt-med'>{assignment.summary}</p>
          </Col>
          <Col>
            <label>Start Date:</label>
            <p className='summary-data xt-med'>{moment(assignment.startDate).format('YYYY-MM-DD')}</p>
          </Col>
        </Row>
				{assignment.quizQuestions.map((question, index) => generateQuestionAndOpts(index) )}
				<Row className='pt-4 pl-2 pr-2'>
					<Button onClick={handleSubmitButton}>SUBMIT</Button>
				</Row>
			</form>
		</Container>
	)
}

export default HomeworkEditor;