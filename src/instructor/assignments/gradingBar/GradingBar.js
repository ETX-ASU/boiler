import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import "./GradingBar.css";
import {Container, Col, Row, Button} from 'react-bootstrap';
import {ACTIVITY_PROGRESS, HOMEWORK_PROGRESS, STATUS_TEXT} from "../../../app/constants";
import {setCurrentlyReviewedStudentId} from "../../../app/store/appReducer";
import {sendInstructorGradeToLMS} from "../../../utils/RingLeader";

import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleLeft, faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";
library.add(faArrowCircleLeft, faArrowCircleRight);


function GradingBar(props) {
  const dispatch = useDispatch();
  const {assignment, reviewedStudent} = props;

  const displayOrder = useSelector(state => state.app.displayOrder);
  const [resultScore, setResultScore] = useState(calcShownScore(reviewedStudent));
  const [comment, setComment] = useState('');
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  function calcShownScore({homeworkStatus, resultScore, autoScore}) {
    if (homeworkStatus === HOMEWORK_PROGRESS.fullyGraded) return resultScore;
    return (autoScore) ? autoScore : 0;
  }

  const navToPrev = () => {
    let curStudentIndex = displayOrder.indexOf(reviewedStudent.id);
    let navToStudentIndex = (curStudentIndex - 1 < 0) ? displayOrder.length - 1 : curStudentIndex - 1;
    dispatch(setCurrentlyReviewedStudentId(displayOrder[navToStudentIndex]));
  }

  const navToNext = () => {
    let curStudentIndex = displayOrder.indexOf(reviewedStudent.id);
    let navToStudentIndex = (curStudentIndex + 1 >= displayOrder.length) ? 0 : curStudentIndex + 1;
    dispatch(setCurrentlyReviewedStudentId(displayOrder[navToStudentIndex]));
  }

  async function handleSubmitScore() {
    const scoreDataObj = {
      resourceId: assignment.id,
      studentId: reviewedStudent.id,
      resultScore,
      comment,
      activityProgress: ACTIVITY_PROGRESS[reviewedStudent.homeworkStatus],
      gradingProgress: HOMEWORK_PROGRESS.fullyGraded
    };

    const lmsResult = await sendInstructorGradeToLMS(scoreDataObj);
    if (!lmsResult) window.confirm(`We're sorry. We encountered an error while posting the grade for this student's work.`);
    props.refreshHandler();
  }

  return (
    <Container className='p-0 m-0 mt-4 mb-4 login-bar bg-white rounded xt-med xtext-med align-middle'>
      <Row>
        <Col className='align-middle' style={{'maxWidth':'40px'}}>
          <FontAwesomeIcon size='2x' icon={faArrowCircleLeft} onClick={navToPrev} />
        </Col>

        <Col className=''>
          <Container>
            <Row>
              <Col className='col-5' style={{'width':'calc(100% - 100px)'}}>
                <h2>{(isHideStudentIdentity) ? `Student #${reviewedStudent.randomOrderNum}` : reviewedStudent.name}</h2>
                <span className='aside'><h3 className='subtext d-inline-block'>{reviewedStudent.percentCompleted}% Complete | </h3>
                  {STATUS_TEXT[reviewedStudent.homeworkStatus]}</span>
              </Col>
              <Col className='col-7 pt-1 pb-2 xbg-light'>
                <div className='ml-2 mr-5 d-inline-block align-top'>
                  <label htmlFor='autoScore' className='xtext-darkest'>Auto Score</label>
                  <div id={`yourScore`}>{`${reviewedStudent.autoScore} of ${assignment.toolAssignmentData.quizQuestions.reduce((acc, q) => acc + q.gradePointsForCorrectAnswer, 0)}`}</div>
                </div>
                <div className='mr-5 d-inline-block align-top'>
                  <label htmlFor='yourScore' className='xtext-darkest'>Your Score</label>
                  <input id={`yourScore`}
                         type="number"
                         className='form-control'
                         min={0} max={100}
                         onChange={(e) => setResultScore(parseInt(e.target.value))} defaultValue={resultScore}
                         disabled={reviewedStudent.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded}
                  />
                </div>
                <div className='ml-5 mr-2 pt-3 d-inline-block align-middle float-right'>
                  <span className='ml-1 mr-0'>
                    <Button className='btn-med xbg-darkest'
                      disabled={reviewedStudent.progress === HOMEWORK_PROGRESS.fullyGraded}
                      onClick={handleSubmitScore}>{(reviewedStudent.resultScore !== undefined) ? `Update` : `Submit`}</Button>
                  </span>
                </div>
              </Col>

            </Row>
          </Container>
        </Col>

        <Col className='align-middle text-right' style={{'maxWidth':'40px'}}>
          <FontAwesomeIcon size='2x' icon={faArrowCircleRight} onClick={navToNext} />
        </Col>
      </Row>

      <Row>
        <Col className='col-12'>
          <input type='text' className='mt-2 form-control' placeholder='Leave feedback' value={comment} onChange={(e) => setComment(e.target.value)}/>
        </Col>
      </Row>

    </Container>
  )
}

export default GradingBar;
