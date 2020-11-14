import React, {Fragment, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import HomeworkListItem from "./HomeworkListItem";
import {SORT_BY} from "../../app/constants";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faBackward, faForward, faCaretLeft, faCaretRight, faPenAlt} from "@fortawesome/free-solid-svg-icons";
library.add(faBackward, faForward, faCaretLeft, faCaretRight);


function HomeworkListing(props) {
  const [curPageNum, setCurPageNum] = useState(1);
  const [sortByTypes, setSortByTypes] = useState([SORT_BY.name]);
  const [pageBtns, setPageBtns] = useState([]);
  const students = props.students;
  const studentsPerPage = props.studentsPerPage;
  const [shownStudents, setShownStudents] = useState([]);
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    setPageCount(Math.ceil(students.length/studentsPerPage));

    if (pageCount <= 5) {
      let newPageBtns = new Array(pageCount).fill(-1);
      setPageBtns(newPageBtns.map((b, i) => i));
    } else {
      // let highNum = curPageNum + 2;
      let lowNum = Math.max(curPageNum-2, 0);
      let highNum = Math.min(curPageNum+2, pageCount);
      if (highNum - lowNum < 5) {
        if (lowNum === 1) highNum = 5;
        if (highNum === pageCount) lowNum = pageCount-5;
      }

      let btnNums = new Array(5).fill(-1).map((b, i) => i + lowNum);
      console.log("btnNums", btnNums);
      setPageBtns(btnNums);
    }

    const topStudentIndex = curPageNum * studentsPerPage + 1;
    const shown = students.filter((s, i) => i >= (topStudentIndex) && i < topStudentIndex+10)
    // console.log("shown: ", shown);
    setShownStudents(shown);
  }, [students, curPageNum, studentsPerPage])


  console.log(`curPage -----> ${curPageNum} | ${pageCount}`)
  return (
    <Fragment>
      <Row className='pt-2 pb-4'>
        <Col>
          {pageCount > 5 &&
          <Button className='page-nav-btn mr-1 xbg-dark text-white' onClick={() => setCurPageNum(Math.max(curPageNum-5, 0))}>
            <FontAwesomeIcon icon={faBackward}/>
          </Button>}
          <Button className='page-nav-btn mr-1 xbg-dark text-white' onClick={() => setCurPageNum(Math.max(curPageNum-1, 0))}>
            <FontAwesomeIcon icon={faCaretLeft}/>
          </Button>
          {pageBtns.map((b, i) => (
            <Button className={`page-btn mr-1 ${curPageNum === b ? 'selected' : ''}`} key={i} onClick={() => setCurPageNum(b)}>{b+1}</Button>
          ))}
          <Button className='page-nav-btn mr-1 xbg-dark text-white' onClick={() => setCurPageNum(Math.min(curPageNum+1, pageCount-1))}>
            <FontAwesomeIcon icon={faCaretRight}/>
          </Button>
          {pageCount > 5 &&
          <Button className='page-nav-btn mr-1 xbg-dark text-white' onClick={() => setCurPageNum(Math.min(curPageNum+5, pageCount-1))}>
            <FontAwesomeIcon icon={faForward}/>
          </Button>}
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
          {!props.isFetchingHomeworks && (students.length > 0) && shownStudents.map((student, rowNum) => (
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
