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
		<li className='list-group-item review-link' onClick={handleReviewHomework}>
      <Container>
        <Row>
          <Col className='col-4'>{itemNum}. {student.name}</Col>
          <Col className='col-5'>{student.email}</Col>
          <Col className='col-3'>{student.homework.percentCompleted}</Col>
        </Row>
      </Container>
    </li>
	)
}

export default HomeworkListItem;
