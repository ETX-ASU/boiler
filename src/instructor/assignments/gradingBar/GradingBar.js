import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import "./GradingBar.css";
import {Container, Col, Row, Button} from 'react-bootstrap';
import {HOMEWORK_PROGRESS, SORT_BY, STATUS_TEXT} from "../../../app/constants";
import {setCurrentlyReviewedStudentId} from "../../../app/store/appReducer";
import {notifyUserOfError} from "../../../utils/ErrorHandling";
import {sendInstructorGradeToLMS} from "../../../utils/RingLeader";

import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleLeft, faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";
library.add(faArrowCircleLeft, faArrowCircleRight);


function GradingBar(props) {
  const dispatch = useDispatch();
  const {assignment, students, reviewedStudent} = props;

  const displayOrder = useSelector(state => state.app.displayOrder);
  const [score, setScore] = useState(calcShownScore(reviewedStudent));
  const [comment, setComment] = useState('');
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  function calcShownScore({homeworkStatus, score, autoScore}) {
    if (homeworkStatus === HOMEWORK_PROGRESS.fullyGraded) return score;
    return (autoScore) ? autoScore : 0;
  }

  const navToPrev = () => {
    let curStudentIndex = displayOrder.findIndex(s => s.id === reviewedStudent.id);
    let navToStudentIndex = (curStudentIndex - 1 < 0) ? displayOrder.length - 1 : curStudentIndex - 1;
    // let navToStudentData = students.find(s => s.id === displayOrder[navToStudentIndex])
    dispatch(setCurrentlyReviewedStudentId(displayOrder[navToStudentIndex]));
  }

  const navToNext = () => {
    let curStudentIndex = displayOrder.findIndex(s => s.id === reviewedStudent.id);
    let navToStudentIndex = (curStudentIndex + 1 >= displayOrder.length) ? 0 : curStudentIndex + 1;
    // let navToStudentData = students.find(s => s.id === displayOrder[navToStudentIndex].id)
    dispatch(setCurrentlyReviewedStudentId(displayOrder[navToStudentIndex]));
  }

  async function handleSubmitScore() {
    const lmsResult = await sendInstructorGradeToLMS({
      assignmentId: assignment.id,
      studentId: reviewedStudent.id,
      score,
      comment,
      progress: HOMEWORK_PROGRESS.fullyGraded
    });
    if (!lmsResult) notifyUserOfError('Notify user there was an error posting the grade for this reviewedStudent\'s homework.')
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
                  <div id={`yourScore`}>{`${reviewedStudent.autoScore} of ${assignment.quizQuestions.reduce((acc, q) => acc + q.gradePointsForCorrectAnswer, 0)}`}</div>
                </div>
                <div className='mr-5 d-inline-block align-top'>
                  <label htmlFor='yourScore' className='xtext-darkest'>Your Score</label>
                  <input id={`yourScore`}
                         type="number"
                         className='form-control'
                         min={0} max={100}
                         onChange={(e) => setScore(parseInt(e.target.value))} defaultValue={score}
                         disabled={reviewedStudent.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded}
                  />
                </div>
                <div className='ml-5 mr-2 pt-3 d-inline-block align-middle float-right'>
                  <span className='ml-1 mr-0'>
                    <Button className='btn-med xbg-darkest'
                      disabled={reviewedStudent.progress === HOMEWORK_PROGRESS.fullyGraded}
                      onClick={handleSubmitScore}>{(reviewedStudent.score !== undefined) ? `Update` : `Submit`}</Button>
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

      {/*<Row className='p-0 xbg-light border-top'>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <label>% Work Completed</label>*/}
      {/*  </Col>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <label>Auto Score</label>*/}
      {/*  </Col>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <label>{`Current Score: (${(reviewedStudent.score !== undefined) ? reviewedStudent.score : '--'})`}</label>*/}
      {/*  </Col>*/}
      {/*  <Col className='col-3 text-right'>*/}
      {/*    <label>{`${numGradedSoFar} of 12 Graded`}</label>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      {/*<Row className='pt-2 pb-2 rounded-bottom grade-bar-bottom-row'>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <span className='stat'>{`${reviewedStudent.percentCompleted}%`}</span>*/}
      {/*  </Col>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <span*/}
      {/*      className='stat'>{`${reviewedStudent.autoScore} of ${assignment.quizQuestions.reduce((acc, q) => acc + q.gradePointsForCorrectAnswer, 0)}`}</span>*/}
      {/*  </Col>*/}
      {/*  <Col className='col-3 text-left'>*/}
      {/*    <input type="number" min={0} max={100} onChange={(e) => setScore(parseInt(e.target.value))} value={score}*/}
      {/*      disabled={reviewedStudent.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded}*/}
      {/*    />*/}
      {/*    <span>*/}
      {/*      <Button className='btn-sm xbg-med ml-1 mr-0'*/}
      {/*      disabled={reviewedStudent.progress === HOMEWORK_PROGRESS.fullyGraded}*/}
      {/*      onClick={handleSubmitScore}>{(reviewedStudent.score !== undefined) ? `UPDATE` : `SUBMIT`}</Button>*/}
      {/*    </span>*/}
      {/*  </Col>*/}

      {/*  /!*<GradingInputForm assignments={assignments} homeworks={homeworks} homework.id={homework.id} activeAssignmentId={activeAssignmentId}/>*!/*/}
      {/*  <Col className='col-3 text-right'>*/}
      {/*    <span><Button className='btn-sm xbg-darkest ml-0 mr-1' onClick={navToPrev}>{'<'}</Button></span>*/}
      {/*    <span><Button className='btn-sm xbg-darkest ml-0 mr-1' onClick={navToNext}>{'>'}</Button></span>*/}
      {/*  </Col>*/}
      {/*</Row>*/}
    </Container>
  )
}

export default GradingBar;
