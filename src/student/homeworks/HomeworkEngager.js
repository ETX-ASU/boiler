import React, {Fragment, useState} from 'react';
import moment from "moment";
import {useDispatch} from "react-redux";
import {MODAL_TYPES, UI_SCREEN_MODES} from "../../app/constants";
import {Button, Container, Row, Col} from 'react-bootstrap';
import {updateHomework as updateHomeworkMutation} from "../../graphql/mutations";
import {API} from "aws-amplify";
import {setActiveUiScreenMode} from "../../app/store/appReducer";
import HeaderBar from "../../app/HeaderBar";

import {library} from "@fortawesome/fontawesome-svg-core";
import {faCheck, faTimes} from '@fortawesome/free-solid-svg-icons'
import ConfirmationModal from "../../app/ConfirmationModal";
import QuizViewerAndEngager from "../../tool/QuizViewerAndEngager";
library.add(faCheck, faTimes);



/** This screen is shown to the student so they can "engage" with the homework assignment.
 * Any work they do or changes or interactions they make would be recorded and the updates
 * saved to the database as necessary. */
function HomeworkEngager(props) {
	const dispatch = useDispatch();
	const {homework, assignment} = props;
	const [formData, setFormData] = useState(Object.assign({}, {quizQuestions:assignment.toolAssignmentData.quizQuestions, quizAnswers:homework.toolHomeworkData.quizAnswers}));
  const [activeModal, setActiveModal] = useState(null);


	async function submitHomeworkForReview() {
    setActiveModal(null);

    try {
      const inputData = Object.assign({}, homework, {
        toolHomeworkData: {quizAnswers: formData.quizAnswers.slice()},
        beganOnDate: (homework.beganOnDate) ? homework.beganOnDate : moment().valueOf(),
        submittedOnDate: (homework.submittedOnDate) ? homework.submittedOnDate : moment().valueOf()
      });
      delete inputData.assignment;
      delete inputData.createdAt;
      delete inputData.updatedAt;
      delete inputData.resultScore;
      delete inputData.comment;
      delete inputData.activityProgress;
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
          <QuizViewerAndEngager quizQuestions={formData.quizQuestions} quizAnswers={formData.quizAnswers}
                                isReadOnly={false} isShowCorrect={false} handleOptSelected={handleOptSelected} />
        </Container>

			</form>
		</Fragment>
	)
}

export default HomeworkEngager;