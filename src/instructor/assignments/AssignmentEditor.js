import React, {Fragment, useState} from 'react';
import {API} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import {updateAssignment as updateAssignmentMutation} from '../../graphql/mutations';
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import {UI_SCREEN_MODES} from "../../app/constants";
import {Button, Col, Container, Row} from "react-bootstrap";
import "./assignments.scss";
import HeaderBar from "../../app/HeaderBar";
import ToggleSwitch from "../../app/assets/ToggleSwitch";
import QuizCreator from "./QuizCreator";
import {notifyUserOfError} from "../../utils/ErrorHandling";


function AssignmentEditor() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(useSelector(state => state.app.assignment));
  const isLimitedEditing = useSelector(state => Boolean(state.app.homeworks?.length));

  async function handleCancelBtn() {
    alert("you are cancelling.");
    // dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
  }

  async function handleUpdateButton() {
    // TODO: Add mechanism to verify or perhaps create an undo mechanism, so maybe record previous state here before API call?
    if (!formData.title || !formData.summary) return;

    const inputData = Object.assign({}, formData);
    delete inputData.createdAt;
    delete inputData.updatedAt;

    try {
      await API.graphql({query: updateAssignmentMutation, variables: {input: inputData}});
    } catch (e) {
      notifyUserOfError(e);
    }

    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
  }


  function toggleUseAutoScore(e) {
    setFormData({...formData, isUseAutoScore: !formData.isUseAutoScore, isUseAutoSubmit: false});
  }

  function handleQuizChanges(quizQuestions) {
    setFormData({...formData, quizQuestions});
  }


  // function handleAddQuestionButton(e) {
  // 	const quizQuestions = formData.quizQuestions;
  //
  // 	let newQuestions = quizQuestions.slice();
  // 	newQuestions.push({
  // 		questionText: `Question #${quizQuestions.length+1}`,
  // 		answerOptions: ['Answer A'],
  // 		correctAnswerIndex: 0,
  // 		progressPointsForCompleting: 1,
  // 		gradePointsForCorrectAnswer: 10
  // 	});
  // 	setFormData({...formData, quizQuestions:newQuestions})
  // }
  //
  // function handleQuestionChange(e, qNum, propName) {
  // 	const quizQuestions = formData.quizQuestions;
  // 	quizQuestions[qNum][propName] = e.target.value;
  // 	setFormData({...formData, quizQuestions})
  // }
  //
  // function handleOptionChange(e, qNum, index) {
  // 	const options = formData.quizQuestions[qNum].answerOptions.slice();
  // 	options[index] = e.target.value;
  // 	if ((!e.target.value) && (index-1 <= formData.quizQuestions.length)) options.splice(index, 1);
  //
  // 	const quizQuestions = formData.quizQuestions;
  // 	quizQuestions[qNum].answerOptions = options;
  // 	setFormData({...formData, quizQuestions})
  // }
  //
  // function addAnswerOpt(qNum) {
  // 	const newQuizQuestions = formData.quizQuestions.slice();
  // 	newQuizQuestions[qNum].answerOptions = newQuizQuestions[qNum].answerOptions.slice();
  // 	newQuizQuestions[qNum].answerOptions.push("");
  //
  // 	setFormData({...formData, quizQuestions: newQuizQuestions})
  // }
  //
  // function removeAnswerOpt(qNum) {
  // 	const newQuizQuestions = formData.quizQuestions.slice();
  // 	newQuizQuestions[qNum].answerOptions = newQuizQuestions[qNum].answerOptions.slice();
  // 	if (newQuizQuestions[qNum].answerOptions.length > 1) newQuizQuestions[qNum].answerOptions.pop();
  // 	console.warn("formData", newQuizQuestions);
  //
  // 	setFormData({...formData, quizQuestions:newQuizQuestions})
  // }

  //
  // function generateQuestionForm(qNum) {
  // 	const qData = formData.quizQuestions[qNum];
  // 	return (
  // 		<Fragment key={qNum}>
  // 			{/* Arbitrary maximum of 3 questions per quiz for this boilerplate.*/}
  // 			{(!qNum && formData.quizQuestions.length < 3) && <div className='add-question-btn text-center' onClick={handleAddQuestionButton} />}
  // 			<h4>The Quiz Question ({qNum+1} of {formData.quizQuestions.length})</h4>
  //
  // 			<div className="quiz-question">
  // 				<div className="input-bar">
  // 					<label>Question Text</label>
  // 					<input onChange={e => handleQuestionChange(e, qNum, 'questionText')} defaultValue={qData.questionText}/>
  // 				</div>
  //
  // 				<div className="input-bar">
  // 					<label>List of possible answers</label>
  // 					<div className="options-list">
  // 						{qData.answerOptions.map((opt, index) =>
  // 							<input key={index} onChange={e => handleOptionChange(e, qNum, index)} defaultValue={opt}/>
  // 						)}
  // 						<div className='add-remove-opts-bar'>
  // 							{/* Arbitrary maximum of 5 answer options per question for this boilerplate.*/}
  // 							<Button className='btn-sm btn-dark add-answer-opt' disabled={(qData.answerOptions.length >= 5 || qData.answerOptions[qData.answerOptions.length-1] === '')} onClick={() => addAnswerOpt(qNum)}> + </Button>
  // 							<Button className="btn-sm btn-dark remove-answer-opt" disabled={qData.answerOptions.length <= 1} onClick={() => removeAnswerOpt(qNum)}> - </Button>
  // 						</div>
  // 					</div>
  // 				</div>
  //
  // 				<div className="input-bar">
  // 					<label>Index of correct answer (0-based)</label>
  // 					<input type="number" min={0} max={10}
  // 								 onChange={e => handleQuestionChange(e, qNum, 'correctAnswerIndex')}
  // 								 defaultValue={qData.correctAnswerIndex}/>
  // 				</div>
  //
  // 				<div className="input-bar">
  // 					<label>Grade points for giving correct answer</label>
  // 					<input type="number" min={0} max={1000}
  // 								 onChange={e => handleQuestionChange(e, qNum, 'gradePointsForCorrectAnswer')}
  // 								 defaultValue={qData.gradePointsForCorrectAnswer}/>
  // 				</div>
  //
  // 				<div className="input-bar">
  // 					<label>Progress points for completing this question</label>
  // 					<input type="number" min={0} max={1000}
  // 								 onChange={e => handleQuestionChange(e, qNum, 'progressPointsForCompleting')}
  // 								 defaultValue={qData.progressPointsForCompleting}/>
  // 				</div>
  // 				<hr/>
  // 			</div>
  // 		</Fragment>
  // 	)
  // }

  // function thing() {
  //   return(
  // 	<div className="AssignmentEditor">
  // 		<form>
  // 			<div className="input-bar lumped-with-next">
  // 				<label>Assignment Title:</label>
  // 				<input onChange={e => setFormData({...formData, 'title': e.target.value})}
  // 							 defaultValue={formData.title}/>
  // 			</div>
  //
  // 			<div className="input-bar">
  // 				<label>Assignment Summary:</label>
  // 				<input onChange={e => setFormData({...formData, 'summary': e.target.value})}
  // 							 defaultValue={formData.summary}/>
  // 			</div>
  //
  // 			<div className="input-bar lumped-with-next">
  // 				<label>Locked after student submission?</label>
  // 				<input type={'checkbox'}
  // 							 onChange={e => setFormData({...formData, 'isLockedOnSubmission': e.target.value})}
  // 							 defaultChecked={formData.isLockedOnSubmission}/>
  // 			</div>
  //
  // 			<div>
  // 				{formData.quizQuestions.map((question, qNum) => generateQuestionForm(qNum))}
  // 			</div>
  // 		</form>
  //
  // 		<button onClick={handleUpdateButton}>UPDATE ASSIGNMENT</button>
  //
  // 	</div>)
  // }


  return (
    <Fragment>
      <HeaderBar
        title='Edit Assignment'
        isLimitedEditing={isLimitedEditing}
        canCancel={true} canSave={true} onCancel={handleCancelBtn} onSave={handleUpdateButton}/>
      <form>
        <Container className='mt-2 ml-2 mr-2 mb-4'>
          <Row className={'mt-4 mb-4'}>
            <Col><h2>Basic Assignment Details</h2></Col>
          </Row>

          <Row className={'ml-2'}>
            <Col className={'col-12'}>
              <div className={'form-group'}>
                <label htmlFor='dataTitle'><h3>Title</h3></label>
                <input id='dataTitle' className={'form-control'}
                       onChange={e => setFormData({...formData, 'title': e.target.value})}
                       defaultValue={formData.title}/>
              </div>
              <div className={'form-group'}>
                <label htmlFor='dataSummary'><h3>Summary<span className='aside'> - Optional</span></h3></label>
                <textarea id='dataSummary' className={'form-control'}
                          onChange={e => setFormData({...formData, 'summary': e.target.value})}
                          defaultValue={formData.summary}/>
              </div>
            </Col>
          </Row>
          <Row className={'ml-2'}>
            <Col className='col-6'>
              <label><h3>Autoscore</h3></label>
            </Col>
            <Col className='col-6 d-flex flex-row-reverse'>
              <div className="custom-control custom-switch" style={{top: `6px`}}>
                <ToggleSwitch disabled={isLimitedEditing} value={formData.isUseAutoScore}
                              handleToggle={toggleUseAutoScore}/>
              </div>
            </Col>
          </Row>
          {formData.isUseAutoScore &&
          <Row className={'ml-2'}>
            <Col>
              <p>
            <span className='mr-2'>
              <input type={'checkbox'}
                     disabled={isLimitedEditing}
                     onChange={e => setFormData({...formData, isUseAutoSubmit: e.target.checked})}
                     checked={formData.isUseAutoSubmit}/>
            </span>
                Auto-submit score to LMS when student submits their assignment</p>
            </Col>
          </Row>
          }
        </Container>

        <QuizCreator
          isLimitedEditing={isLimitedEditing}
          isUseAutoScore={formData.isUseAutoScore}
          quizQuestions={formData.quizQuestions}
          setQuizQuestions={handleQuizChanges}/>
      </form>
    </Fragment>
  )
}

export default AssignmentEditor;