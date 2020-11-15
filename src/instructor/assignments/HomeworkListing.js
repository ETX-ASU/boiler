import React, {Fragment, useEffect, useState} from 'react';
import {Button, Col, Container, Row} from "react-bootstrap";
import LoadingIndicator from "../../app/assets/LoadingIndicator";
import HomeworkListItem from "./HomeworkListItem";
import {HOMEWORK_PROGRESS, SORT_BY, SORT_DIRECTION, STATUS_TEXT} from "../../app/constants";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import {
  faBackward,
  faForward,
  faCaretLeft,
  faCaretRight,
  faComment,
  faPercent, faEdit, faCheck, faCaretDown, faCaretUp
} from "@fortawesome/free-solid-svg-icons";
import {useDispatch, useSelector} from "react-redux";
import {setDisplayOrder} from "../../app/store/appReducer";
library.add(faBackward, faForward, faCaretLeft, faCaretRight, faComment, faPercent, faEdit, faCheck, faCaretDown, faCaretUp);


function HomeworkListing(props) {
  const dispatch = useDispatch();
  const [curPageNum, setCurPageNum] = useState(0);
  const [sortBy, setSortBy] = useState({type:SORT_BY.name, direction:SORT_DIRECTION.ascending});
  const [pageBtns, setPageBtns] = useState([]);
  // const [sortedStudents, setSortedStudents] = useState(props.students);
  const studentsPerPage = props.studentsPerPage;
  const [shownStudents, setShownStudents] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const isHideStudentIdentity = useSelector(state => state.gradingBar.isHideStudentIdentity);

  useEffect(() => {
    setPageCount(Math.ceil(props.students.length/studentsPerPage));

    if (pageCount <= 5) {
      let newPageBtns = new Array(pageCount).fill(-1);
      setPageBtns(newPageBtns.map((b, i) => i));
    } else {
      const lowNum = Math.min(Math.max(curPageNum-2, 0), pageCount-5);
      let btnNums = new Array(5).fill(-1).map((b, i) => i + lowNum);
      setPageBtns(btnNums);
    }

    const topStudentIndex = curPageNum * studentsPerPage;
    const sortedStudents = getSortedStudents(props.students.slice(), sortBy.type, sortBy.direction);
    dispatch(setDisplayOrder(sortedStudents.map(s => s.id)));
    // setSortedStudents(sortedStudents);


    const shown = sortedStudents.filter((s, i) => i >= (topStudentIndex) && i < topStudentIndex + studentsPerPage)
    setShownStudents(shown);
  }, [props.students, sortBy, curPageNum, studentsPerPage, isHideStudentIdentity])


  function getSortedStudents(items, type, direction) {
    const sortType = `${type}-${direction}`;

    switch (sortType) {
      case `${SORT_BY.name}-${SORT_DIRECTION.ascending}`:
        if (isHideStudentIdentity) {
          items.sort((a, b) => a.randomOrderNum - b.randomOrderNum);
        } else {
          items.sort((a, b) => a.name.localeCompare(b.name));
        }
        break;
      case `${SORT_BY.name}-${SORT_DIRECTION.descending}`:
        if (isHideStudentIdentity) {
          items.sort((a, b) => b.randomOrderNum - a.randomOrderNum);
        } else {
          items.sort((a, b) => b.name.localeCompare(a.name));
        }
        break;
      case `${SORT_BY.autoScore}-${SORT_DIRECTION.ascending}`:
        items.sort((a, b) => a.autoScore - b.autoScore);
        break;
      case `${SORT_BY.autoScore}-${SORT_DIRECTION.decending}`:
        items.sort((a, b) => b.autoScore - a.autoScore);
        break;
      case `${SORT_BY.score}-${SORT_DIRECTION.ascending}`:
        items.sort((a, b) => a.score - b.score);
        break;
      case `${SORT_BY.score}-${SORT_DIRECTION.decending}`:
        items.sort((a, b) => b.score - a.score);
        break;
      // case `${SORT_BY.status}-${HOMEWORK_PROGRESS.inProgress}`:
      //   items.sort((a, b) => {
      //     let res = a.percentCompleted - b.percentCompleted;
      //     return (res) ? res : a.name.localeCompare(b.name);
      //   });
      //   break;
      // case `${SORT_BY.status}-${HOMEWORK_PROGRESS.submitted}`:
      //   items.sort((a, b) => {
      //     if (a.homeworkStatus === HOMEWORK_PROGRESS.submitted && b.homeworkStatus !== HOMEWORK_PROGRESS.submitted) return -1;
      //     if (a.homeworkStatus === HOMEWORK_PROGRESS.fullyGraded)
      //     let res = a.percentCompleted - b.percentCompleted;
      //     return (res) ? res : a.name.localeCompare(b.name);
      //   });
      //   break;
      // case `${SORT_BY.status}-${HOMEWORK_PROGRESS.fullyGraded}`:
      //   items.sort((a, b) => b.name.localeCompare(a.name));
      //   break;
    }
    return items;
  }

  function toggleSortOn(type) {
    if (type === sortBy.type) {
      if (sortBy.direction === SORT_DIRECTION.ascending) {
        setSortBy({type:sortBy.type, direction: SORT_DIRECTION.descending});
      } else {
        setSortBy({type:sortBy.type, direction: SORT_DIRECTION.ascending});
      }
    } else {
      if (type === SORT_BY.name || type === SORT_BY.score || type === SORT_BY.autoScore) {
        setSortBy({type:type, direction: SORT_DIRECTION.ascending});
      }
    }
  }


  function getHomeworksList() {
    return (
      shownStudents.map((student, rowNum) => <HomeworkListItem key={student.id} rowNum={rowNum+1} student={student} />)
    )
  }

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
        <Col className="pr-4">
          {props.isFetchingHomeworks &&
            <LoadingIndicator className='p-4 text-center h-100 align-middle' isDarkSpinner={true} loadingMsg={'FETCHING STUDENT HOMEWORK'} size={3} />
          }

          {(!props.isFetchingHomeworks && props.students.length > 0) &&
          (<table className="listing table table-hover">
            <thead>
              <tr>
                <th scope="col" className={`pb-1 pt-2 student-col ${sortBy.type === SORT_BY.name ? 'sort-col' : ''}`}>
                  <span onClick={() => toggleSortOn(SORT_BY.name)}>Student
                    {/*{(sortBy.type === SORT_BY.name && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}*/}
                    {/*{(sortBy.type === SORT_BY.name && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}*/}
                  </span>
                </th>
                <th scope="col" className={`pb-1 pt-2 mini-col text-center ${sortBy.type === SORT_BY.autoScore ? 'sort-col' : ''}`}>
                  <span onClick={() => toggleSortOn(SORT_BY.autoScore)}>Auto
                    {/*{(sortBy.type === SORT_BY.autoScore && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}*/}
                    {/*{(sortBy.type === SORT_BY.autoScore && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}*/}
                  </span>
                </th>
                <th scope="col" className={`pb-1 pt-2 mini-col text-center ${sortBy.type === SORT_BY.score ? 'sort-col' : ''}`}>
                  <span onClick={() => toggleSortOn(SORT_BY.score)}>Final
                    {/*{(sortBy.type === SORT_BY.score && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}*/}
                    {/*{(sortBy.type === SORT_BY.score && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}*/}
                  </span>
                </th>
                <th scope="col" className="pb-1 pt-2 mini-col text-center"><FontAwesomeIcon icon={faComment}/></th>
                <th scope="col" className="pb-1 pt-2 status-col" colSpan={2}>
                  Progress
                  <span className='float-right'>
                    <FontAwesomeIcon className='ml-2' icon={faPercent} onClick={() => toggleSortOn(HOMEWORK_PROGRESS.inProgress)} />
                    <FontAwesomeIcon className='ml-2' icon={faEdit} onClick={() => toggleSortOn(HOMEWORK_PROGRESS.submitted)} />
                    <FontAwesomeIcon className='ml-2' icon={faCheck} onClick={() => toggleSortOn(HOMEWORK_PROGRESS.completed)} />
                  </span>
                </th>
              </tr>
              <tr className='marker-row'>
                <th scope="col" className={`marker student-col ${sortBy.type === SORT_BY.name ? 'sort-col' : ''}`}>
                  {(sortBy.type === SORT_BY.name && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}
                  {(sortBy.type === SORT_BY.name && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}
                </th>
                <th scope="col" className={`marker ${sortBy.type === SORT_BY.autoScore ? 'sort-col' : ''}`}>
                  {(sortBy.type === SORT_BY.autoScore && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}
                  {(sortBy.type === SORT_BY.autoScore && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}
                </th>
                <th scope="col" className={`marker ${sortBy.type === SORT_BY.score ? 'sort-col' : ''}`}>
                  {(sortBy.type === SORT_BY.score && sortBy.direction === SORT_DIRECTION.descending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}
                  {(sortBy.type === SORT_BY.score && sortBy.direction === SORT_DIRECTION.ascending) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}
                </th>
                <th scope="col" className={`marker ${sortBy.type === SORT_BY.comment ? 'sort-col' : ''}`}>
                  {(sortBy.type === SORT_BY.comment && sortBy.direction) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}
                  {(sortBy.type === SORT_BY.comment && !sortBy.direction) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}
                </th>
                <th scope="col" className={`marker status-col ${sortBy.type === SORT_BY.comment ? 'sort-col' : ''}`} colSpan={2}>
                  {/*{(sortBy.type === SORT_BY.comment && sortBy.direction) && <FontAwesomeIcon className={'ml-2'} icon={faCaretDown}/>}*/}
                  {/*{(sortBy.type === SORT_BY.comment && !sortBy.direction) && <FontAwesomeIcon className={'ml-2'} icon={faCaretUp}/>}*/}
                </th>
              </tr>
            </thead>
            <tbody>
              {getHomeworksList()}
            </tbody>
            </table>
          )}
          {!props.isFetchingHomeworks && (props.students.length < 1) &&
            <p className='mt-4'>No students have begun their homework for this assignment yet.</p>
          }
        </Col>
      </Row>
    </Fragment>
  )
}

export default HomeworkListing;
