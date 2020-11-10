import React, {Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import HomeworkListItem from "./HomeworkListItem";


function HomeworkListing(props) {
  const students = props.students;

  return (
    <Fragment>
      <Row>
        <Col>
          <hr />
        </Col>
        <Col className='w-auto xt-large xtext-dark font-weight-bold'>Cohort Dashboard</Col>
        <Col>
          <hr />
        </Col>
      </Row>

      <Row>
        <Col className='col-5 align-bottom'>Name</Col>
        <Col className='col-1 align-bottom'>Auto<br/>Score</Col>
        <Col className='col-1 align-bottom'>Final<br/>Score</Col>
        <Col className='col-1 align-bottom'>Completed</Col>
        <Col className='col-4 align-bottom text-right'>Grading Status</Col>
      </Row>
      <Row>
        <Col className="pr-4">
          {props.isFetchingHomeworks &&
            <LoadingIndicator className='p-4 text-center h-100 align-middle' isDarkSpinner={true} loadingMsg={'FETCHING STUDENT HOMEWORK'} size={3} />
          }
          {!props.isFetchingHomeworks && (students.length > 0) && students.map((student, rowNum) => (
            <HomeworkListItem key={student.id} rowNum={rowNum+1} student={student} />
          ))}
          {!props.isFetchingHomeworks && (students.length < 1) &&
            <p className='mt-4'>No students have begun their homework for this assignment yet.</p>
          }
        </Col>
      </Row>
    </Fragment>
  )
}

export default HomeworkListing;
