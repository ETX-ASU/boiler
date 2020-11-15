import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setCurrentlyReviewedStudentId} from "../../app/store/appReducer";


function HomeworkListItem(props) {
  const dispatch = useDispatch();
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);
	const student= props.student;

  const studentRefName = (isHideStudentIdentity) ? `Student #${student.randomOrderNum}` : student.name;

  function handleReviewHomework() {
    dispatch(setCurrentlyReviewedStudentId(student.id));
  }

	return (
    <tr onClick={handleReviewHomework} className={'review-link'}>
      <td>{studentRefName}</td>
      <td className='text-center'>{(student.autoScore !== undefined) ? student.autoScore : '--'}</td>
      <td className='text-center'>{(student.score !== undefined) ? student.score : '--'}</td>
      <td className='text-center'>{(student.comment !== undefined) ? student.comment : '--'}</td>
      <td className=''>{student.homeworkStatus}</td>
      <td className='text-right'>{student.percentCompleted}%</td>
    </tr>
	)
}

export default HomeworkListItem;
