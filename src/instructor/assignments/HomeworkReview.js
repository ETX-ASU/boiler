import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {HOMEWORK_PROGRESS} from "../../app/constants";
import {Container, Row, Col} from 'react-bootstrap';
import "../../student/homeworks/homeworks.scss";
import GradingBar from "./gradingBar/GradingBar";
import {getStatusMsg} from "../../utils/homeworkUtils";


function HomeworkReview(props) {
  const {students, reviewedStudentId, assignment} = props;
  const reviewedStudent = students.find(s => s.id === reviewedStudentId);
  const {homework, homeworkStatus, randomOrderNum} =  reviewedStudent;
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  const showWork = (homeworkStatus === HOMEWORK_PROGRESS.submitted || homeworkStatus === HOMEWORK_PROGRESS.fullyGraded);

  const studentRefName = (isHideStudentIdentity) ? `Student #${randomOrderNum}` : reviewedStudent.name;
  const statusMsg = getStatusMsg(studentRefName);

  console.log('------> reviewedStudent', reviewedStudent);

  function getStatusMsg(studentRefName) {
    switch(homeworkStatus) {
      case(HOMEWORK_PROGRESS.notBegun): return `${studentRefName} has not started their work yet.`;
      case(HOMEWORK_PROGRESS.inProgress): return`${studentRefName} completed A PORTION of their homework, but never submitted it.`;
      // case(HOMEWORK_PROGRESS.inProgress): return`${studentRefName} completed ${percentCompleted} of their homework, but never submitted it.`;
      case(HOMEWORK_PROGRESS.submitted): return`${studentRefName}'s homework is ready for grading.`;
      case(HOMEWORK_PROGRESS.fullyGraded): return`You have already graded ${studentRefName}'s homework`;
      default: return `no progress information for ${studentRefName}`;
    }
  }

	return (
		<Container className="homework-viewer">
      <Row>
        <Col className='p-0 pr-4'>
          <GradingBar refreshHandler={props.refreshGrades} assignment={assignment} students={students} reviewedStudent={reviewedStudent}/>
        </Col>
      </Row>

      <Row className='p-0'>
        <Col className='w-auto xt-large xtext-dark font-weight-bold xbg-light'>{studentRefName}</Col>
      </Row>

      {!isHideStudentIdentity &&
      <Row className='mt-5 mb-5 p-0'>
        <Col className='p-0'>
          <label>Student:</label>
          <p className='summary-data xt-med ml-3 mb-2'>{studentRefName}</p>
        </Col>
        <Col className='no-gutters'>
          <label>Email:</label>
          <p className='summary-data xt-med ml-3 mb-2'>{reviewedStudent.email}</p>
        </Col>
        <Col className='no-gutters'>
          <label>Progress:</label>
          <p className='summary-data xt-med ml-3 mb-2'>{homeworkStatus}</p>
        </Col>
      </Row>
      }

      {showWork && assignment.quizQuestions.map((question, index) =>
        <Row key={index}>
          <Col className="quiz-question">
            <label>You answered question #{index+1} as follows:</label>
            <legend>{assignment.quizQuestions[index].questionText}</legend>
            {assignment.quizQuestions[index].answerOptions.map((optText, optNum) =>
              <div key={optNum} className="form-check">
                {(homework.quizAnswers[index] === optNum) && <span className="selected-indicator">></span>}
                <label className={`form-check-label reviewed-answer ${(homework.quizAnswers[index] === optNum) ? "checked" : ""}`} htmlFor={`q-${index}-opt-${optNum}`}>{optText}</label>
              </div>
            )}
            <hr />
          </Col>
        </Row>
      )}

      {!showWork &&
      <Row className='mt-5 mb-5'>
        <Col className='w-auto xt-large xtext-dark font-weight-bold'>{statusMsg}</Col>
      </Row>
      }

    </Container>
	)
}

export default HomeworkReview;