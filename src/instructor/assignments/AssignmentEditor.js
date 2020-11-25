import React, {Fragment, useState} from 'react';
import {API} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import {updateAssignment as updateAssignmentMutation} from '../../graphql/mutations';
import {setActiveUiScreenMode, setAssignmentData} from "../../app/store/appReducer";
import {UI_SCREEN_MODES, MODAL_TYPES} from "../../app/constants";
import {Button, Col, Container, Row} from "react-bootstrap";
import "./assignments.scss";
import HeaderBar from "../../app/components/HeaderBar";
import ToggleSwitch from "../../app/components/ToggleSwitch";
import QuizCreator from "../../tool/QuizCreator";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../app/components/ConfirmationModal";


function AssignmentEditor() {
  const dispatch = useDispatch();
  const urlAssignmentId = useSelector(state => state.app.assignmentId);
  const [formData, setFormData] = useState(useSelector(state => state.app.assignment));
  const isLimitedEditing = useSelector(state => Boolean(state.app.homeworks?.length));
  const [activeModal, setActiveModal] = useState(null);

  async function handleCancelBtn() {
    if (!urlAssignmentId) {
      setActiveModal({type: MODAL_TYPES.cancelDupedAssignmentEditsWarning});
    } else {
      setActiveModal({type: MODAL_TYPES.cancelNewAssignmentEditsWarning});
    }
  }

  async function handleUpdateBtn() {
    // TODO: Add mechanism to verify or perhaps create an undo mechanism, so maybe record previous state here before API call?
    if (!formData.title || !formData.summary) return;

    const inputData = Object.assign({}, formData);
    delete inputData.createdAt;
    delete inputData.updatedAt;

    try {
      await API.graphql({query: updateAssignmentMutation, variables: {input: inputData}});
    } catch (error) {
      window.confirm(`We're sorry. An error occurred while trying to update the edits to your assignment. Please wait a moment and try again. Error: ${error}`);
    }

    if (!urlAssignmentId) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createOrDupeAssignment));
    } else {
      dispatch(setAssignmentData(formData));
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
    }
  }


  function toggleUseAutoScore(e) {
    setFormData({...formData, isUseAutoScore: !formData.isUseAutoScore, isUseAutoSubmit: false});
  }

  function handleQuizChanges(toolAssignmentData) {
    setFormData({...formData, toolAssignmentData});
  }


  function returnToNewOrDupeAssignmentScreen(e) {
    setActiveModal(null);
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createOrDupeAssignment));
  }

  function returnToViewAssignmentScreen(e) {
    setActiveModal(null);
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
  }

  function renderModal() {
    switch (activeModal.type) {
      case MODAL_TYPES.cancelDupedAssignmentEditsWarning:
        return (
          <ConfirmationModal title={'Cancel Edits Warning'} buttons={[
            {name:'Cancel', onClick:returnToNewOrDupeAssignmentScreen},
            {name:'Continue Editing', onClick: () => setActiveModal(null)},
          ]}>
            <p>Do you want to cancel editing this duplicated assignment or continue?</p>
            <p>Canceling will lose any edits you have made.</p>
          </ConfirmationModal>
        )
      case MODAL_TYPES.cancelNewAssignmentEditsWarning:
        return (
          <ConfirmationModal title={'Cancel Creation Warning'} buttons={[
            {name:'Cancel', onClick:returnToViewAssignmentScreen},
            {name:'Continue Creating', onClick: () => setActiveModal(null)},
          ]}>
            <p>Do you want to cancel new assignment creation or continue editing?</p>
            <p>Canceling will not save your new assignment.</p>
          </ConfirmationModal>
        )
    }
  }

  return (
    <Fragment>
      {activeModal && renderModal()}
      <HeaderBar title={`Edit: ${formData.title}`} >
        <Button onClick={handleCancelBtn} className='mr-2'>Cancel</Button>
        <Button onClick={handleUpdateBtn}>Update</Button>
      </HeaderBar>
      {isLimitedEditing &&
      <Row className='m-4 p-0 alert alert-warning' role='alert'>
        <Col className={'alert-block p-3 text-center'}>
          <FontAwesomeIcon icon={faExclamationTriangle} size='2x' inverse/>
        </Col>
        <Col className='col-10'>
          <p className='m-3'>Students have begun their assignment, therefore some options can no longer be changed and are disabled.</p>
        </Col>
      </Row>
      }
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
          toolAssignmentData={formData.toolAssignmentData}
          updateToolAssignmentData={handleQuizChanges}/>
      </form>
    </Fragment>
  )
}

export default AssignmentEditor;