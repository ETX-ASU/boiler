import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {ACTIVITY_PROGRESS, HOMEWORK_PROGRESS, MODAL_TYPES, UI_SCREEN_MODES} from "../../app/constants";
import LoadingIndicator from "../../app/components/LoadingIndicator";
import {
  setActiveUiScreenMode,
  setGradesData,
  addHomeworksData,
  setCurrentlyReviewedStudentId,
  toggleHideStudentIdentity
} from "../../app/store/appReducer";
import {Button, Container, Row, Col} from 'react-bootstrap';
import {API, graphqlOperation} from "aws-amplify";
import {listHomeworks} from "../../graphql/queries";
import HomeworkReview from "./HomeworkReview";
import HomeworkListing from "./HomeworkListing";
import {fetchAllGrades, sendInstructorGradeToLMS} from "../../lmsConnection/RingLeader";
import {useStudents} from "../../app/store/AppSelectors";
import HeaderBar from "../../app/components/HeaderBar";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faEdit, faPen, faChevronLeft, faCheck} from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../app/components/ConfirmationModal";
library.add(faEdit, faPen, faChevronLeft);


const SUBMISSION_MODAL_OPTS = {
  all: 'all',
  submittedOnly: 'submittedOnly'
}

function AssignmentViewer(props) {
	const dispatch = useDispatch();
  const isHideStudentIdentity = useSelector(state => state.app.isHideStudentIdentity);
  const assignment = useSelector(state => state.app.assignment);
  const reviewedStudentId = useSelector(state => state.app.currentlyReviewedStudentId);
  const [isLoadingHomeworks, setIsLoadingHomeworks] = useState(true);
  const [nextTokenVal, setNextTokenVal] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const students = useStudents();


  useEffect(() => {
    console.log('assignment changed')
    if (!assignment?.id) return;
    console.log('fetching scores etc')
    fetchScores();
    fetchBatchOfHomeworks('INIT');
  }, [assignment.id, assignment]);

  useEffect(() => {
    if (nextTokenVal) fetchBatchOfHomeworks(nextTokenVal);
  }, [nextTokenVal]);


  /**
   * AWS and DynamoDB limits listing query results to 20 results OR 1MB total, whichever comes first. Thus,
   * we query until we have all of the homework fetched for this assignment.
   *
   * This might get sluggish if we have a class with hundreds of students with large amounts of data fetched
   * in each homework record. If that is the case, the expensive portion of homework should not be fetched here
   * and instead only fetched when that individual homework is shown/reviewed by the instructor or student.
   *
   * @returns {Promise<void>}
   */
  async function fetchBatchOfHomeworks(token) {
    if (token === "INIT") token = null;

    API.graphql(graphqlOperation(listHomeworks, {
      filter: {assignmentId: {eq: assignment.id}},
      nextToken: token
    }))
    .then(handleHomeworksResult)
    .catch((error) => window.confirm(`We're sorry. There was a problem fetching student work. Error: ${error}`)
    );
  }

  function handleHomeworksResult(result) {
    let rawHomeworks = result.data.listHomeworks.items;

    if (isLoadingHomeworks) setIsLoadingHomeworks(false);

    dispatch(addHomeworksData(rawHomeworks));

    setNextTokenVal(result.data.listHomeworks.nextToken);
  }

  async function fetchScores() {
    try {
      let grades = await fetchAllGrades(assignment.id);
      grades = (grades) ? grades : [];
      await dispatch(setGradesData(grades));
    } catch (error) {
      window.confirm(`We're sorry. There was an error fetching student grade data. Please wait a moment and try again. Error: ${error}`);
    }
  }

  function handleRefreshAfterGradeSubmission() {
    fetchScores();
    console.log('-----------> handleRefreshAfterGradeSubmission()')
  }

	function handleEditBtn() {
		dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.editAssignment));
	}

	async function handleBatchSubmit() {
    try {
      const radioElems = Array.from(document.getElementsByName('modalRadioOpts'));
      const isSubmittedOnly = radioElems.find(e => e.checked).value === SUBMISSION_MODAL_OPTS.submittedOnly;

      await Promise.all(students.forEach(s => {
        const status = s.homework.homeworkStatus;
        if (status === HOMEWORK_PROGRESS.fullyGraded) return;
        if (isSubmittedOnly && status !== HOMEWORK_PROGRESS.submitted) return;
        handleSubmitScore(s, assignment)
      }));
    } catch(error) {
      window.confirm("Sorry. There appears to have been an error when batch submitting grades. Please refresh and try again.");
    }
		setActiveModal(null);
	}

  function toggleHideAndRandomize(e) {
    dispatch(toggleHideStudentIdentity(!isHideStudentIdentity));
  }

  async function handleSubmitScore(student, assignment) {
    const scoreDataObj = {
      resourceId: assignment.id,
      studentId: student.id,
      resultScore: student.homework.autoScore,
      comment: student.homework.comment || '',
      activityProgress: ACTIVITY_PROGRESS[student.homework.homeworkStatus],
      gradingProgress: HOMEWORK_PROGRESS.fullyGraded
    };

    const lmsResult = await sendInstructorGradeToLMS(scoreDataObj);
    if (!lmsResult) window.confirm(`We're sorry. We encountered an error while posting the grade for this student's work.`);
    props.refreshHandler();
  }


  function renderModal() {
    switch (activeModal.type) {
      case MODAL_TYPES.showBatchSubmitOptions:
        return (
          <ConfirmationModal onHide={() => setActiveModal(null)} title={'Batch Submit'} buttons={[
            {name: 'Cancel', onClick: () => setActiveModal(null)},
            {name: 'Submit', onClick: (e) => handleBatchSubmit(e)},
          ]}>
            <p>Submit auto-scores for...</p>
            <form id={'batchSubmitModalForm'} >
              <input type="radio" name={`modalRadioOpts`} value={SUBMISSION_MODAL_OPTS.all} />
              <label>All students, including those with incomplete/non-submitted work</label>
              <input type="radio" name={`modalRadioOpts`} defaultChecked={true} value={SUBMISSION_MODAL_OPTS.submittedOnly} />
              <label>Only students who completed/submitted their work</label>
            </form>
            <p>(Note: batch auto submission will <em>not</em> overwrite any scores you may have manually submitted.)</p>
          </ConfirmationModal>
        );
    }
  }

	return (
    <Fragment>
      {activeModal && renderModal()}

      {(!reviewedStudentId) ?
        <HeaderBar title={`Overview: ${(assignment?.title) ? assignment.title : ''}`}>
          <Button onClick={handleEditBtn}>
            <FontAwesomeIcon className='btn-icon' icon={faPen}/>Edit
          </Button>
        </HeaderBar> :
        <HeaderBar onBackClick={() => dispatch(setCurrentlyReviewedStudentId(''))} title={assignment?.title}>
          <span className='mr-2'>
            <input type={'checkbox'} onChange={toggleHideAndRandomize} checked={isHideStudentIdentity}/>
            Hide identity & randomize
          </span>
        </HeaderBar>
      }

      <Container className="assignment-viewer">
        {props.loading &&
          <div className="nav-pane">
            <LoadingIndicator loadingMsg={'LOADING ASSIGNMENT DATA'} size={3} />
          </div>
        }
        {!reviewedStudentId &&
        <Fragment>
          <Row className='mt-2 mb-2 pt-2 pb-2'>
            <Col className='col-6'>
              <Button onClick={() => setActiveModal({type:MODAL_TYPES.showBatchSubmitOptions})}>
                <FontAwesomeIcon className='btn-icon' icon={faPen} />Batch Submit
              </Button>
            </Col>
            <Col className='text-right'>
              <span className='mr-2'>
                <input className='mr-2' type={'checkbox'} onChange={toggleHideAndRandomize} checked={isHideStudentIdentity}/>
                Hide identity & randomize
              </span>
            </Col>
          </Row>
          <Row className='mt-2 mb-5'>
            <Col>
              <h3>Summary</h3>
              <p className='summary-data xt-med'>{assignment.summary}</p>
            </Col>
            <Col className='col-3 text-right'>
              <h3>Autoscore</h3>
              <p className='summary-data xt-med float-right'>
                {assignment.isUseAutoScore && <FontAwesomeIcon className='mr-2' icon={faCheck} size='lg'/>}
                {(assignment.isUseAutoScore) ? 'Enabled' : 'Disabled'}
              </p>
            </Col>
          </Row>
          <HomeworkListing isFetchingHomeworks={isLoadingHomeworks} students={students} studentsPerPage={15}/>
        </Fragment>
        }

        {reviewedStudentId && (students?.length > 0) &&
          <HomeworkReview refreshGrades={handleRefreshAfterGradeSubmission} assignment={assignment} students={students} reviewedStudentId={reviewedStudentId} />
        }
      </Container>
    </Fragment>
	)
}

export default AssignmentViewer;