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
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";


function AssignmentEditor() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(useSelector(state => state.app.assignment));
  const isLimitedEditing = useSelector(state => Boolean(state.app.homeworks?.length));

  async function handleCancelBtn() {
    alert("you are cancelling.");
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
  }

  async function handleUpdateBtn() {
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


  return (
    <Fragment>
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
          quizQuestions={formData.quizQuestions}
          setQuizQuestions={handleQuizChanges}/>
      </form>
    </Fragment>
  )
}

export default AssignmentEditor;