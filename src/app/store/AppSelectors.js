import {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {calcAutoScore, calcPercentCompleted, getHomeworkStatus, getNewToolHomeworkDataForAssignment} from "../../tool/ToolUtils";
import {HOMEWORK_PROGRESS, ROLE_TYPES} from "../constants";
import {shuffle} from "../utils/shuffle";

export function useStudents() {
  const {assignment, members, homeworks, grades} = useSelector(state => state.app);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log("useStudents()");
    if (!assignment?.id || !members.length) return;
    let studentsOnly = members.filter(m => m.roles.indexOf(ROLE_TYPES.learner) > -1);
    let positions = shuffle(studentsOnly.map((h, i) => i+1));

    const enhancedDataStudents = studentsOnly.map(s => {
      let gradeDataForStudent = (grades) ? Object.assign({}, grades.find(g => g.studentId === s.id)) : null;
      if (!gradeDataForStudent) gradeDataForStudent = {resultScore:0, resultMaximum:100, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' };

      let homeworkForStudent = homeworks.find(h => (h.studentOwnerId === s.id && h.assignmentId === assignment.id));
      if (!homeworkForStudent) homeworkForStudent = getNewToolHomeworkDataForAssignment(assignment.toolAssignmentData);

      let percentCompleted = calcPercentCompleted(assignment, homeworkForStudent);
      let autoScore = calcAutoScore(assignment, homeworkForStudent);
      let homeworkStatus = getHomeworkStatus(gradeDataForStudent, homeworkForStudent);
      return Object.assign({}, s, {
        randomOrderNum: positions.shift(),
        resultScore: gradeDataForStudent.resultScore,
        resultMaximum: gradeDataForStudent.resultMaximum,
        comment: gradeDataForStudent.comment,
        percentCompleted,
        autoScore,
        homeworkStatus,
        homework: homeworkForStudent
      });
    });

    setStudents(enhancedDataStudents);
  }, [grades, homeworks])

  // console.log("ENHANCED STUDENTS[0] NOW: ", students[0]);
  return students;
}
