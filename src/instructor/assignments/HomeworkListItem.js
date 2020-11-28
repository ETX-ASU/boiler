import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCurrentlyReviewedStudentId} from "../../app/store/appReducer";
import {STATUS_TEXT} from "../../app/constants";

import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowCircleLeft, faArrowCircleRight, faComment} from "@fortawesome/free-solid-svg-icons";
library.add(faArrowCircleLeft, faArrowCircleRight);

function HomeworkListItem(props) {
  const dispatch = useDispatch();
  const isHideStudentIdentity = useSelector(state => state.app.isHideStudentIdentity);
	const student = props.student;

  const studentRefName = (isHideStudentIdentity) ? `Student #${student.randomOrderNum}` : student.name;

  function handleReviewHomework() {
    dispatch(setCurrentlyReviewedStudentId(student.id));
  }

  function handleShowComment(e) {
    e.stopPropagation();
    console.log(`Show comment: ${student.comment}`);
  }

	return (
    <tr onClick={handleReviewHomework} className={'review-link'}>
      <td>{studentRefName}</td>
      <td className='text-center'>{(student.autoScore !== undefined) ? student.autoScore : '--'}</td>
      <td className='text-center'>{(student.scoreGiven !== undefined) ? student.scoreGiven : '--'}</td>
      <td className='text-center'>{student.comment ? <FontAwesomeIcon icon={faComment} onClick={handleShowComment}/> : '--'}</td>
      <td className=''>{STATUS_TEXT[student.homeworkStatus]}</td>
      <td className='text-right'>{student.percentCompleted}%</td>
    </tr>
	)
}

export default HomeworkListItem;
