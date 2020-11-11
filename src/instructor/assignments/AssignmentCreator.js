import React, {Fragment, useState} from 'react';
import {API} from 'aws-amplify';
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {createAssignment as createAssignmentMutation} from '../../graphql/mutations';
import {UI_SCREEN_MODES} from "../../app/constants";
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import "./assignments.scss";

import {Button, Col, Container, Row} from "react-bootstrap";
import {notifyUserOfError} from "../../utils/ErrorHandling";
import HeaderBar from "../../app/HeaderBar";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import ToggleSwitch from "../../app/assets/ToggleSwitch";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {library} from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faPlus);

const emptyAssignment = {
  id: '',
  ownerId: '',
  title: '',
  summary: '',
  image: '',
  isLockedOnSubmission: true,
  lockOnDate: 0,
  isUseAutoscore: true,
  isUseAutosubmit: false,
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

	async function handleCancelBtn() {
	  alert("you are cancelling.");
  }

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

  function toggleUseAutoscore(e) {
    setFormData({...formData, 'isUseAutoscore': !formData.isUseAutoscore});
  }


	function handleAddQuestionButton(e) {
		const quizQuestions = formData.quizQuestions;

		console.warn("ADDING QUESTION: ", quizQuestions);
		let newQuestions = quizQuestions.slice();
		newQuestions.push({
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
				{/*{(!qNum && formData.quizQuestions.length < 3) && <div className='add-question-btn text-center' onClick={handleAddQuestionButton} />}*/}
        <h3 className={'subtext mt-2 mb-2'}>Question ({qNum+1} of {formData.quizQuestions.length})</h3>

        <Container className='mt-4'>
          <Row className='m-2 border-bottom'>
            <Col className={'col-12'}>
              <div className={'form-group'}>
                <label><h3>Prompt</h3></label>
                <input className={'form-control'} onChange={e => setFormData({...formData, 'questionText': e.target.value})} defaultValue={qData.questionText} />
              </div>
            </Col>
          </Row>
          <Row className='m-2'>
            <Col className={'col-12'}>
              <div className={'form-group'}>
                <label><h3>Answer Choice List</h3></label>
              </div>
            </Col>
          </Row>
          {qData.answerOptions.map((opt, index) =>
            <div key={index} className='m-2 form-inline align-items-center'>
              <div className='col'>
                <div className='input-group mb-2'>
                  <label className='m-2' htmlFor={`data-q${qNum}-a${index}`}><h3 className='subtext'>{index+1})</h3></label>
                  <input type='text' className='form-control' id={`data-q${qNum}-a${index}`}
                         onChange={e => handleOptionChange(e, qNum, index)} defaultValue={opt}
                         placeholder={`Answer ${index+1}`}/>
                  <div className='input-group-append'>
                    <div className='input-group-text form-control'>
                      <input className="form-check-inline" type="checkbox" />
                      correct answer
                    </div>
                  </div>
                  <Button className='ml-2 btn xbg-dark mb-2'>
                    <FontAwesomeIcon className='btn-icon mr-0' icon={["fa", "trash"]} />
                  </Button>
                </div>
              </div>
            </div>


          )}
        </Container>


				<div className="quiz-question">
					{/*<div className="input-bar">*/}
					{/*	<label>Question Text</label>*/}
					{/*	<input onChange={e => handleQuestionChange(e, qNum, 'questionText')} defaultValue={qData.questionText}/>*/}
					{/*</div>*/}

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
    <Fragment>
      <HeaderBar title='Create New Assignment' canCancel={true} canSave={true} onCancel={handleCancelBtn} onSave={handleSubmitButton} />

      <form>
        <Container className='m-2'>
        <Row className={'mt-4 mb-4'}>
          <Col><h2>Basic Assignment Details</h2></Col>
        </Row>

        <Row className={'ml-2'}>
          <Col className={'col-12'}>
            <div className={'form-group'}>
              <label htmlFor='dataTitle'><h3>Title</h3></label>
              <input id='dataTitle' className={'form-control'} onChange={e => setFormData({...formData, 'title': e.target.value})} defaultValue={formData.title} />
            </div>
            <div className={'form-group'}>
              <label htmlFor='dataSummary'><h3>Summary<span className='aside'> - Optional</span></h3></label>
              <input id='dataSummary' className={'form-control'} onChange={e => setFormData({...formData, 'summary': e.target.value})} defaultValue={formData.summary}/>
            </div>
          </Col>
        </Row>
        <Row className={'ml-2'}>
          <Col className='col-6'>
            <label><h3>Autoscore</h3></label>
          </Col>
          <Col className='col-6 d-flex flex-row-reverse'>
            <div className="custom-control custom-switch" style={{top: `6px`}}>
              <ToggleSwitch id='dataUseAutoscore' value={formData.isUseAutoscore} handleToggle={toggleUseAutoscore} />
            </div>
          </Col>
        </Row>
        {formData.isUseAutoscore &&
        <Row className={'ml-2 mb-4'}>
          <Col>
            <input type={'checkbox'}
              onChange={e => setFormData({...formData, 'isUseAutosubmit': e.target.value})}
              defaultChecked={formData.isUseAutosubmit} />
            <label>Auto-submit score to LMS when student submits their assignment</label>
          </Col>
        </Row>
        }
        </Container>
        <Container>
          <h2 className='mb-3'>Quiz Details</h2>
          {formData.quizQuestions.map((question, qNum) => generateQuestionForm(qNum))}
        </Container>
      </form>
    </Fragment>
  )
}

export default AssignmentCreator;