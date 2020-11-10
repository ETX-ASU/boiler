import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {useDispatch} from "react-redux";
import {setCurrentlyReviewedStudentId} from "../../app/store/appReducer";


function HomeworkListItem(props) {
  const dispatch = useDispatch();
	const student= props.student;
	const itemNum = (props.rowNum < 10) ? "0"+props.rowNum : props.rowNum;

  function handleReviewHomework() {
    dispatch(setCurrentlyReviewedStudentId(student.id));
  }

	return (
    <Row onClick={handleReviewHomework} className={'review-link'}>
      <Col className='col-5'>{itemNum}. {student.name}</Col>
      <Col className='col-1'>{(student.autoScore !== undefined) ? student.autoScore : '--'}</Col>
      <Col className='col-1'>{(student.score !== undefined) ? student.score : '--'}</Col>
      <Col className='col-1 text-right'>{student.percentCompleted}%</Col>
      <Col className='col-4 text-right'>{student.homeworkStatus}</Col>
    </Row>
	)
}

export default HomeworkListItem;
