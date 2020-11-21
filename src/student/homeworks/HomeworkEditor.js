import React, {Fragment, useState} from 'react';
import moment from "moment";
import {useDispatch} from "react-redux";
import {MODAL_TYPES, UI_SCREEN_MODES} from "../../app/constants";
import {Button, Container, Row, Col} from 'react-bootstrap';
import {updateHomework as updateHomeworkMutation} from "../../graphql/mutations";
import {API} from "aws-amplify";
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import HeaderBar from "../../app/HeaderBar";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from "../../app/ConfirmationModal";
import QuizViewerAndEditor from "../../toolDisplays/QuizViewerAndEditor";
library.add(faCheck, faTimes);



/** This screen is shown to the student so they can "engage" with the homework assignment.
 * Any work they do or changes or interactions they make would be recorded and the updates
 * saved to the database as necessary. */
function HomeworkEditor(props) {
	const dispatch = useDispatch();
	const {homework, assignment} = props;
	const [formData, setFormData] = useState(Object.assign({}, {quizQuestions:assignment.quizQuestions, quizAnswers:homework.quizAnswers}));
  const [activeModal, setActiveModal] = useState(null);


	async function submitHomeworkForReview() {
    setActiveModal(null);

    try {
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
      delete inputData.gradingProgress;

      const result = await API.graphql({query: updateHomeworkMutation, variables: {input: inputData}});
      if (result) {
        setActiveModal({type: MODAL_TYPES.confirmHomeworkSubmitted})
      } else {
        window.confirm(`We're sorry. There was a problem submitting your homework for review. Please wait a moment and try again.`);
      }
    } catch (error) {
      window.confirm(`We're sorry. There was a problem submitting your homework for review. Please wait a moment and try again. Error: ${error}`);
    }
  }

  async function closeModalAndReview() {
    setActiveModal(null);
    dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.reviewHomework));
    await props.refreshHandler();
  }


	function handleOptSelected(qNum, optNum) {
		const quizAnswers = formData.quizAnswers.slice();
    quizAnswers[qNum] = optNum;
		setFormData(Object.assign({}, formData, {quizAnswers}))
	}

  function renderModal() {
    switch (activeModal.type) {
      case MODAL_TYPES.warningBeforeHomeworkSubmission:
        return (
          <ConfirmationModal title={'Are you sure?'} buttons={[
            {name:'Cancel', onClick: () => setActiveModal(null)},
            {name:'Submit', onClick:submitHomeworkForReview},
          ]}>
            <p>Once submitted, you cannot go back to make additional edits to your assignment.</p>
          </ConfirmationModal>
        )
      case MODAL_TYPES.confirmHomeworkSubmitted:
        return (
          <ConfirmationModal title={'Submitted!'} buttons={[
            {name:'Review', onClick:closeModalAndReview},
          ]}>
            <p>You can now review your submitted assignment.</p>
          </ConfirmationModal>
        )
    }
  }


/*
  function styleForAnswer(qNum, selectedAnswerIndex, isShowCorrect) {
    const isSelected = (formData.quizAnswers[qNum] === selectedAnswerIndex);
    if (!isSelected) return '';
    const isCorrect = formData.quizQuestions[qNum].correctAnswerIndex === selectedAnswerIndex;
    return (!isShowCorrect) ? 'selected' : (isCorrect) ? 'selected correct-selection' : 'selected incorrect-selection';
  }

  function isCorrectChoice(qNum, selectedAnswerIndex) {
    return (formData.quizAnswers[qNum] === selectedAnswerIndex)
  }

  function renderQuestionsAndAnswers(isReadOnly, showCorrect = false) {
    return (
      formData.quizQuestions.map((question, qNum) =>
      <Fragment key={qNum}>
        <Row className='mt-4'>
          <Col>
            <h3 className={'subtext mt-2 mb-3 ml-1'}>Question ({qNum+1} of {formData.quizQuestions.length})</h3>
          </Col>
        </Row>
        <Row className='ml-3 mr-2'>
          <Col>
            <h3>Question</h3>
            <p>{question.questionText}</p>
            <h3>Your Answer</h3>
          </Col>
        </Row>
        <Row className='ml-4 mr-2 mt-1 p-2 pt-3 xbg-light'>
          {question.answerOptions.map((opt, index) =>
            <div key={index} className={`input-group mb-2 answer-opt ${styleForAnswer(qNum, index, false)}`}>
              <div className="input-group-prepend">
                <span className="input-group-text">{index+1}</span>
              </div>
              <div className={'form-control h-auto opt-text'} onClick={(isReadOnly) ? null : () => handleOptSelected(qNum, index)} aria-label={opt}>
                {opt}
                { (formData.quizAnswers[qNum] === index) &&
                <div className="input-group-append float-right">
                  {(isReadOnly || (showCorrect && isCorrectChoice(qNum, index))) && <FontAwesomeIcon icon={faCheck} size='lg'/>}
                  {(showCorrect && !isCorrectChoice(qNum, index)) && <FontAwesomeIcon icon={faTimes} size='lg'/>}
                </div>
                }
              </div>
            </div>
          )}
        </Row>
      </Fragment>
    ))
  }
*/


	return (
		<Fragment>
      {activeModal && renderModal()}
      <HeaderBar title={assignment.title}>
        <Button onClick={() => setActiveModal({type:MODAL_TYPES.warningBeforeHomeworkSubmission})}>Submit</Button>
      </HeaderBar>

			<form>
        <Container className='mt-2 ml-1 mr-2'>
          <Row className={'mt-4'}>
            <Col><p>{assignment.summary}</p></Col>
          </Row>
        </Container>

        <Container className='pb-5'>
          <QuizViewerAndEditor quizQuestions={formData.quizQuestions} quizAnswers={formData.quizAnswers}
                               isReadOnly={false} isShowCorrect={false} handleOptSelected={handleOptSelected} />
        </Container>

			</form>
		</Fragment>
	)
}

export default HomeworkEditor;