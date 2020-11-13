import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {UI_SCREEN_MODES} from "../../app/constants";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import {
  setActiveUiScreenMode,
  setGradesData,
  addHomeworksData,
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


function AssignmentViewer(props) {
	const dispatch = useDispatch();
  const homeworks = useSelector(state => state.app.homeworks);
  // const isSkipGradedStudents = useSelector(state => state.gradingBar.isSkipGradedStudents);
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  const activeUser = useSelector(state => state.app.activeUser);
  const assignment = useSelector(state => state.app.assignment);
  const reviewedStudentId = useSelector(state => state.app.currentlyReviewedStudentId);

  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [isLoadingHomeworks, setIsLoadingHomeworks] = useState(true);
  const [nextTokenVal, setNextTokenVal] = useState(null);
  const students = useStudents();


  useEffect(() => {
    if (!assignment?.id) return;
    fetchScores();
    fetchBatchOfHomeworks('INIT');
  }, []);

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
    //
    // let updatedCount = 0;
    // const updatedStudents = students.map(s => {
    //   const matchingHomework = rawHomeworks.find(h => (h.studentOwnerId === s.id && h.assignmentId === assignment.id));
    //   if (!matchingHomework) return s;
    //
    //   updatedCount++;
    //   let studentOutput = {quizAnswers:matchingHomework.quizAnswers};
    //   matchingHomework.percentCompleted = calcPercentCompleted(assignment, matchingHomework);
    //   matchingHomework.autoScore = calcAutoScore(assignment, matchingHomework);
    //   matchingHomework.progress = getHomeworkStatus(s.homework.gradingProgress, matchingHomework);
    //   delete matchingHomework.assignment;
    //   delete matchingHomework.studentOwnerId;
    //   delete matchingHomework.assignmentId;
    //   delete matchingHomework.quizAnswers;
    //
    //   return Object.assign({}, s, {
    //     homework: Object.assign({}, s.homework, matchingHomework, {studentOutput})})
    // })

    if (isLoadingHomeworks) setIsLoadingHomeworks(false);

    dispatch(addHomeworksData(rawHomeworks));

    setNextTokenVal(result.data.listHomeworks.nextToken);
  }

  async function fetchScores() {
    try {
      const grades = await fetchAllGrades(assignment.id);
      await dispatch(setGradesData(grades));
    } catch (error) {
      notifyUserOfError(error);
    }
  }

  function handleRefreshAfterGradeSubmission() {
    fetchScores();
    console.log('-----------> handleRefreshAfterGradeSubmission()')
  }

	function handleEditButton() {
		dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.editAssignment));
	}

  function toggleHideAndRandomize(e) {
    e.stopPropagation();
    dispatch(toggleHideStudentIdentity(!isHideStudentIdentity));
  }



	if (props.isLoading) {
		return (
			<div className="nav-pane">
				<LoadingIndicator loadingMsg={'LOADING ASSIGNMENT DATA'} size={3} />
			</div>
		)
	}

	return (
		<Container className="assignment-viewer">
      <Row className='xbg-light'>
        <Col><h2>Sportzball</h2></Col>
        <Col className='col-3 text-right'><Button className='btn-sm xbg-dark m-2' onClick={handleEditButton}>Edit Assignment</Button></Col>
      </Row>
      {!reviewedStudentId && (students?.length > 0) &&
      <Fragment>
        <Row className='mt-2 mb-5'>
          <Col className='text-left'>
            {/*<Button className='btn-sm xbg-dark m-2' disabled={!students?.length} onClick={handleGradingButton}>Start Grading</Button>*/}
          </Col>
          <Col className='text-left'>
            <label onClick={(e) => e.stopPropagation()} className='m-0 mr-3 text-white align-middle'>
              <input type={'checkbox'} className='mr-1 no-click-thru' onChange={toggleHideAndRandomize} defaultChecked={isHideStudentIdentity}/>
              Hide identities & randomize
            </label>
          </Col>
          {/*<Col className='text-right'>*/}
          {/*  <Button className='btn-sm xbg-dark m-2' onClick={handleEditButton}>Edit Assignment</Button>*/}
          {/*</Col>*/}
        </Row>
        <HomeworkListing isFetchingHomeworks={isLoadingHomeworks} students={students} />
      </Fragment>
      }

      {reviewedStudentId &&
        // <HomeworkReview refreshHandler={fetchHomeworksAndGradesForActiveAssignment} activeHomeworkData={activeHomeworkData} />
        <HomeworkReview refreshGrades={handleRefreshAfterGradeSubmission} assignment={assignment} students={students} reviewedStudentId={reviewedStudentId} />
      }
		</Container>
	)
}

export default AssignmentViewer;