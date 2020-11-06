import {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {calcAutoScore, calcPercentCompleted, getHomeworkStatus} from "../../utils/homeworkUtils";
import {EMPTY_HOMEWORK, HOMEWORK_PROGRESS, ROLE_TYPES} from "../constants";
import {shuffle} from "../../utils/shuffle";

export function useStudents() {
  const {assignment, members, homeworks, grades} = useSelector(state => state.app);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    console.log("useStudents()");
    if (!grades?.length || !homeworks?.length || !assignment?.id || !members.length) return;
    let studentsOnly = members.filter(m => m.roles.indexOf(ROLE_TYPES.learner) > -1);
    let positions = shuffle(studentsOnly.map((h, i) => i+1));

    const enhancedDataStudents = studentsOnly.map(s => {
      let gradeDataForStudent = Object.assign({}, grades.find(g => g.studentId === s.id));
      if (!gradeDataForStudent) gradeDataForStudent = {instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' };

      let homeworkForStudent = homeworks.find(h => (h.studentOwnerId === s.id && h.assignmentId === assignment.id));
      if (!homeworkForStudent) homeworkForStudent = Object.assign({}, EMPTY_HOMEWORK, {quizAnswers:Array(assignment.quizQuestions.length).fill[-1]});

      let percentCompleted = calcPercentCompleted(assignment, homeworkForStudent);
      let autoScore = calcAutoScore(assignment, homeworkForStudent);
      let homeworkStatus = getHomeworkStatus(gradeDataForStudent, homeworkForStudent);
      return Object.assign({}, s, {randomOrderNum:positions.shift(), percentCompleted, autoScore, homeworkStatus, homework: homeworkForStudent});
    });

    setStudents(enhancedDataStudents);
  }, [grades, homeworks])

  console.log("ENHANCED STUDENTS[0] NOW: ", students[0]);
  return students;
}
