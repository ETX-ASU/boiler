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
  isUseAutoScore: true,
  isUseAutoSubmit: false,
  quizQuestions: [{
    questionText: '',
    answerOptions: ['', ''],
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

  function toggleUseAutoScore(e) {
	  // const isUseAutoSubmit = (formData.isUseAutoScore) ? false : formData.isUseAutoSubmit;
    setFormData({...formData, isUseAutoScore: !formData.isUseAutoScore, isUseAutoSubmit:false});
  }


	function handleAddQuestionButton(e) {
		const quizQuestions = formData.quizQuestions;
		let newQuestions = quizQuestions.slice();
		newQuestions.push({
			questionText: '',
			answerOptions: ['', ''],
			correctAnswerIndex: 0,
			progressPointsForCompleting: 1,
			gradePointsForCorrectAnswer: (formData.isUseAutoScore) ? 10 : 0
		});
		setFormData({...formData, quizQuestions:newQuestions})
	}

	function handleQuestionChange(e, qNum, propName) {
		const quizQuestions = formData.quizQuestions;
		quizQuestions[qNum][propName] =  e.target.value;
		setFormData({...formData, quizQuestions})
	}

  function handleCorrectAnswerSelected(e, qNum, index) {
    console.log(`correctAnswerIndex. WAS = ${formData.quizQuestions[qNum].correctAnswerIndex} | NOW = ${index}`);
    const quizQuestions = formData.quizQuestions.slice();
    quizQuestions[qNum].correctAnswerIndex = index;
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

	function removeAnswerOpt(qNum, optIndex) {
	  let correctIndex = formData.quizQuestions[qNum].correctAnswerIndex;
    correctIndex = (correctIndex <= optIndex) ? correctIndex : correctIndex-1;
    correctIndex = Math.max(correctIndex, 0);

		const newQuizQuestions = formData.quizQuestions.slice();
		newQuizQuestions[qNum].answerOptions.splice(optIndex, 1);
		newQuizQuestions[qNum].correctAnswerIndex = correctIndex;

		setFormData({...formData, quizQuestions:newQuizQuestions})
	}

	function generateQuestionForm(qNum) {
		const qData = formData.quizQuestions[qNum];
		console.log(`isUseAutoSubmit`, formData.isUseAutoSubmit);
		return (
		  <Fragment key={qNum}>
				{/* Arbitrary maximum of 3 questions per quiz for this boilerplate.*/}
				{/*{(!qNum && formData.quizQuestions.length < 3) && <div className='add-question-btn text-center' onClick={handleAddQuestionButton} />}*/}
        <h3 className={'subtext mt-2 mb-2'}>Question ({qNum+1} of {formData.quizQuestions.length})</h3>

        <Container className='mt-4'>
          <Row className='m-2 border-bottom'>
            <Col>
              <div className='input-group w-100 pb-3'>
                <label htmlFor={`q${qNum}-prompt`} className='mr-0' style={{width:'calc(100% - 108px'}}>
                  <h3>Prompt</h3>
                  <input id={`q${qNum}-prompt`}
                    className={'form-control'}
                    onChange={e => setFormData({...formData, questionText: e.target.value})}
                    placeholder={`Provide text for Question #${qNum+1}`}
                    defaultValue={qData.questionText} />
                </label>

                {formData.isUseAutoScore &&
                <label htmlFor={`q${qNum}-points`}>
                  <h3>Points</h3>
                  <input id={`q${qNum}-points`}
                         type="number"
                         className='form-control input-group-append'
                         disabled={Boolean(!formData.isUseAutoScore)}
                         min={0} max={1000}
                         onChange={e => handleQuestionChange(e, qNum, 'gradePointsForCorrectAnswer')}
                         defaultValue={qData.gradePointsForCorrectAnswer}/>
                </label>
                }
                </div>
            </Col>
          </Row>

          <Row className='m-2'>
            <Col className={'col-12'}>
              <div className={'form-group'}>
                <label><h3>Answer Options</h3></label>
              </div>
            </Col>
          </Row>

          {qData.answerOptions.map((opt, index) =>
            <Row key={index} className='m-2 form-inline align-items-center'>
              <Col>
                <div className='input-group'>
                  <label className='ml-2 mr-2' htmlFor={`data-q${qNum}-a${index}`}><h3 className='subtext'>{index+1})</h3></label>
                  <input type='text' className='form-control' id={`data-q${qNum}-a${index}`}
                         onChange={e => handleOptionChange(e, qNum, index)} value={opt}
                         placeholder={`Answer ${index+1}`}/>
                  <div className='input-group-append'>
                    <div className='input-group-text form-control'>
                      <input className="form-check-inline" type="radio" name={`q${qNum}RadioOpts`}
                             onChange={e => handleCorrectAnswerSelected(e, qNum, index)}
                             checked={qData.correctAnswerIndex===index}/>
                      correct
                    </div>
                  </div>
                  <Button className='ml-2 btn xbg-dark'
                          disabled={qData.answerOptions.length <= 1}
                          onClick={() => removeAnswerOpt(qNum, index)}>
                    <FontAwesomeIcon className='btn-icon mr-0' icon={["fa", "trash"]} />
                  </Button>
                </div>
              </Col>
            </Row>
          )}
          <Row className='m-2'>
            <Col className={'col-12 m-2 p-2 border-top'}>
              <Button className='align-middle pl-3 pr-3 xbg-dark' disabled={qData.answerOptions.length >= 5} onClick={() => addAnswerOpt(qNum)}>
                Add an option
              </Button>
            </Col>
          </Row>
        </Container>
		  </Fragment>
		)
	}

	return (
    <Fragment>
      <HeaderBar title='Create New Assignment' canCancel={true} canSave={true} onCancel={handleCancelBtn} onSave={handleSubmitButton} />

      <form>
        <Container className='mt-2 ml-2 mr-2 mb-4'>
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
              <textarea id='dataSummary' className={'form-control'} onChange={e => setFormData({...formData, 'summary': e.target.value})} defaultValue={formData.summary}/>
            </div>
          </Col>
        </Row>
        <Row className={'ml-2'}>
          <Col className='col-6'>
            <label><h3>Autoscore</h3></label>
          </Col>
          <Col className='col-6 d-flex flex-row-reverse'>
            <div className="custom-control custom-switch" style={{top: `6px`}}>
              <ToggleSwitch id='dataUseAutoscore' value={formData.isUseAutoScore} handleToggle={toggleUseAutoScore} />
            </div>
          </Col>
        </Row>
        {formData.isUseAutoScore &&
        <Row className={'ml-2'}>
          <Col>
            <p>
            <span className='mr-2'>
              <input type={'checkbox'}
                onChange={e => setFormData({...formData, isUseAutoSubmit: e.target.checked})}
                checked={formData.isUseAutoSubmit} />
            </span>
            Auto-submit score to LMS when student submits their assignment</p>
          </Col>
        </Row>
        }
        </Container>
        <Container>
          <h2 className='mb-3'>Quiz Details</h2>
          {formData.quizQuestions.map((question, qNum) => generateQuestionForm(qNum))}

          <Row className='mt-3 mb-5'>
            <Col className='text-center'>
              <h3 className={'subtext'}>
                <Button className='align-middle rounded-circle xbg-dark p-0 m-2' style={{width:'40px', height:'40px'}} onClick={handleAddQuestionButton}>
                  <FontAwesomeIcon className='btn-icon mr-0' icon={["fa", "plus"]} />
                </Button>
                Add another question
              </h3>
            </Col>
          </Row>
        </Container>
      </form>
    </Fragment>
  )
}

export default AssignmentCreator;