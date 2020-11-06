import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import "./GradingBar.css";
import {Container, Col, Row, Button} from 'react-bootstrap';
import {toggleHideStudentIdentity, toggleSkipGradedStudents} from "./store/gradingBarReducer";
import {HOMEWORK_PROGRESS, SORT_BY} from "../../../app/constants";
import {setCurrentlyReviewedStudentId} from "../../../app/store/appReducer";
import {mockSendGradeToLMS as sendGradeToLMS} from "../../../utils/mockRingLeaderAPIs";
import {notifyUserOfError} from "../../../utils/ErrorHandling";


function GradingBar(props) {
  const dispatch = useDispatch();
  const {assignment, students, reviewedStudent} = props;
  const homework = reviewedStudent.homework;

  const sortMode = useSelector(state => state.gradingBar.sortGradingBy);

  const [reviewQueue, setReviewQueue] = useState([]);
  const [score, setScore] = useState(calcShownScore(homework));
  const [numGradedSoFar, setNumGradedSoFar] = useState(0);

  useEffect(() => {
    let tempStudents = students.map(s => ({id:s.id, name:s.name, randomOrderNum: s.randomOrderNum, homeworkStatus:s.homework.progress}))

    switch(sortMode) {
      case SORT_BY.name:
        tempStudents.sort((a, b) => a.name.localeCompare(b.name));
        setReviewQueue(tempStudents);
        break;
      case SORT_BY.random:
        tempStudents.sort((a, b) => a.randomOrderNum - b.randomOrderNum)
        setReviewQueue(tempStudents);
        break;
      default:
        break;
    }

    setNumGradedSoFar(tempStudents.reduce((acc, s) => (s.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded) ? acc + 1 : acc, 0));
    setScore(calcShownScore(homework))
  }, [sortMode, students, reviewedStudent]);

  function calcShownScore(homework) {
    if (homework.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded) return homework.instructorScore;
    return (homework.autoScore) ? homework.autoScore : 0;
  }

	const navToPrev = () => {
	  let curIndex = reviewQueue.findIndex(s => s.id === reviewedStudent.id);
	  if (--curIndex < 0) curIndex = reviewQueue.length-1;
    dispatch(setCurrentlyReviewedStudentId(reviewQueue[curIndex].id));
	}

  const navToNext = () => {
    let curIndex = reviewQueue.findIndex(s => s.id === reviewedStudent.id);
    if (++curIndex >= reviewQueue.length) curIndex = 0;
    dispatch(setCurrentlyReviewedStudentId(reviewQueue[curIndex].id));
  }

  function handleScoreChange(e) {
    setScore(e.target.value);
  }

  async function handleSubmitScore() {
    const lmsResult = await sendGradeToLMS(reviewedStudent.id, score, '');
    if (!lmsResult) notifyUserOfError('Notify user there was an error posting the grade for this reviewedStudent\'s homework.')
  }

	return (
		<Container className='p-0 m-0 mt-4 mb-4 login-bar bg-white rounded xt-med xtext-med align-middle'>
			<Row className='p-0 xbg-light border-top'>
				<Col className='col-3 text-left'>
          <label>% Work Completed</label>
				</Col>
        <Col className='col-3 text-left'>
          <label>Auto Score</label>
        </Col>
        <Col className='col-3 text-left'>
          <label>Your Score</label>
        </Col>
        <Col className='col-3 text-right'>
          <label>{`${numGradedSoFar} of 12 Graded`}</label>
        </Col>
			</Row>
      <Row className='pt-2 pb-2 rounded-bottom grade-bar-bottom-row' >
        <Col className='col-3 text-left'>
          <span className='stat'>{`${reviewedStudent.percentCompleted}%`}</span>
        </Col>
        <Col className='col-3 text-left'>
          <span className='stat'>{`${reviewedStudent.autoScore} of ${assignment.quizQuestions.reduce((acc, q) => acc + q.gradePointsForCorrectAnswer, 0)}`}</span>
        </Col>
        <Col className='col-3 text-left'>
          <input type="number" min={0} max={100} onChange={handleScoreChange} value={score}
                 disabled={homework.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded}
          />
          <span><Button className='btn-sm xbg-med ml-1 mr-0'
                        // disabled={homework.progress === HOMEWORK_PROGRESS.fullyGraded}
                        onClick={handleSubmitScore}>{`SUBMIT`}</Button></span>
        </Col>
        {/*<GradingInputForm assignments={assignments} homeworks={homeworks} homework.id={homework.id} activeAssignmentId={activeAssignmentId}/>*/}
        <Col className='col-3 text-right'>
          <span><Button className='btn-sm xbg-darkest ml-0 mr-1' onClick={navToPrev}>{'<'}</Button></span>
          <span><Button className='btn-sm xbg-darkest ml-0 mr-1' onClick={navToNext}>{'>'}</Button></span>
        </Col>
      </Row>
		</Container>

	)
}

export default GradingBar;
