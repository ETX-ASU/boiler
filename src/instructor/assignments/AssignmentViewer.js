import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {UI_SCREEN_MODES} from "../../app/constants";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import {
  setActiveUiScreenMode,
  setGradesData,
  addHomeworksData, setCurrentlyReviewedStudentId,
} from "../../app/store/appReducer";
import {Button, Container, Row, Col} from 'react-bootstrap';
import {API, graphqlOperation} from "aws-amplify";
import {listHomeworks} from "../../graphql/queries";
import HomeworkReview from "./HomeworkReview";
import HomeworkListing from "./HomeworkListing";
import {fetchAllGrades} from "../../utils/RingLeader";
import {notifyUserOfError} from "../../utils/ErrorHandling";
import {useStudents} from "../../app/store/AppSelectors";
import {toggleHideStudentIdentity} from "./gradingBar/store/gradingBarReducer";
import HeaderBar from "../../app/HeaderBar";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faEdit, faPen, faChevronLeft, faCheck} from "@fortawesome/free-solid-svg-icons";
library.add(faEdit, faPen, faChevronLeft);


function AssignmentViewer(props) {
	const dispatch = useDispatch();
  const homeworks = useSelector(state => state.app.homeworks);
  // const isSkipGradedStudents = useSelector(state => state.gradingBar.isSkipGradedStudents);
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  const assignment = useSelector(state => state.app.assignment);
  const reviewedStudentId = useSelector(state => state.app.currentlyReviewedStudentId);

  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isLoadingHomeworks, setIsLoadingHomeworks] = useState(true);
  const [nextTokenVal, setNextTokenVal] = useState(null);
  const students = useStudents();


  useEffect(() => {
    console.log('assignment changed')
    if (!assignment?.id) return;
    console.log('fetching scores etc')
    fetchScores();
    fetchBatchOfHomeworks('INIT');
  }, [assignment.id]);

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
    console.log('----------------- fetch batch o homeworks');
    if (token === "INIT") token = null;

    API.graphql(graphqlOperation(listHomeworks, {
      filter: {assignmentId: {eq: assignment.id}},
      nextToken: token
    }))
    .then(handleHomeworksResult)
    .catch((e) => notifyUserOfError(e, `=====> ERROR when fetchBatchOfHomeworks`));
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
      notifyUserOfError(error);
    }
  }

  function handleRefreshAfterGradeSubmission() {
    fetchScores();
    console.log('-----------> handleRefreshAfterGradeSubmission()')
  }

	function handleEditBtn() {
		dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.editAssignment));
	}

	function handleBatchSubmitBtn() {
		alert('about to batch submit grades');
	}

  function toggleHideAndRandomize(e) {
    dispatch(toggleHideStudentIdentity(!isHideStudentIdentity));
  }


	return (
    <Fragment>
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
              <Button onClick={handleBatchSubmitBtn}>
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
          // <HomeworkReview refreshHandler={fetchHomeworksAndGradesForActiveAssignment} activeHomeworkData={activeHomeworkData} />
          <HomeworkReview refreshGrades={handleRefreshAfterGradeSubmission} assignment={assignment} students={students} reviewedStudentId={reviewedStudentId} />
        }
      </Container>
    </Fragment>
	)
}

export default AssignmentViewer;