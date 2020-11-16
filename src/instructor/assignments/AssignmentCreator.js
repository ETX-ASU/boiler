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
import HeaderBar from "../../app/HeaderBar";
import ToggleSwitch from "../../app/assets/ToggleSwitch";

import QuizCreator from "./QuizCreator";
import {setModalVisibility, setModalData, setError} from "../../app/store/modalReducer";

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

  // This data is specific to the tool (Quiz tool data is just an array of questions & answers
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
	const activeUser = useSelector(state => state.app.activeUser);
	const courseId = useSelector(state => state.app.courseId);
	const [formData, setFormData] = useState(emptyAssignment);


  function closeModalAndReturnToOptScreen(e) {
    dispatch(setModalVisibility(false));
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createOrDupeAssignment));
  }

	async function handleCancelBtn() {
    console.log('handleCancelBtn()')
    dispatch(setModalData({
      title: 'Cancel Warning',
      prompt: (
        <Fragment>
          <p>Do you want to cancel new assignment or continue editing?</p>
          <p>Canceling will not save your new assignment.</p>
        </Fragment>
      ),
      isShown: true,
      buttons: (
        <Fragment>
          <Button onClick={closeModalAndReturnToOptScreen}>Cancel new assignment</Button>
          <Button onClick={() => dispatch(setModalVisibility(false))}>Continue editing</Button>
        </Fragment>
      )
    }));
  }

	async function handleSubmitBtn() {
	  console.log("Save pants!")
    // TODO: Add mechanism to verify or perhaps create an undo mechanism, so maybe record previous state here before API call?
    if (!formData.title || !formData.summary) return;

		const assignmentId = uuid();
		const inputData = Object.assign({}, formData, {
			id: assignmentId,
      resourceId: '', // TODO: Must remove from DB
      courseId: courseId,
			ownerId: activeUser.id,
			lockOnDate: (formData.isLockedOnDate) ? moment(formData.lockOnDate).valueOf() : 0
		});

		try {
      await API.graphql({query: createAssignmentMutation, variables: {input: inputData}});
      dispatch(setModalData({
        title: 'Assignment Saved',
        prompt: (<p>Assignment has been saved! It is now accessible in your LMS.</p>),
        isShown: true,
        buttons: (<Button onClick={closeModalAndReturnToOptScreen}>Continue</Button>)
      }));
    } catch (error) {
      dispatch(setError(<p>We're sorry. There was a problem saving your new assignment.</p>, error));
    }


	}

  function toggleUseAutoScore(e) {
    setFormData({...formData, isUseAutoScore: !formData.isUseAutoScore, isUseAutoSubmit:false});
  }

  function handleQuizChanges(quizQuestions) {
	  setFormData({...formData, quizQuestions});
  }


	return (
    <Fragment>
      <HeaderBar title='Create New Assignment'>
        <Button onClick={handleCancelBtn} className='mr-2'>Cancel</Button>
        <Button onClick={handleSubmitBtn}>Update</Button>
      </HeaderBar>

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

        {/*The assignment data collected here is specific to the tool, while the above assignment data is used in every tool*/}
        <QuizCreator isUseAutoScore={formData.isUseAutoScore} quizQuestions={formData.quizQuestions} setQuizQuestions={handleQuizChanges}/>
      </form>
    </Fragment>
  )
}

export default AssignmentCreator;