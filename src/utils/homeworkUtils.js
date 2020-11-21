import {HOMEWORK_PROGRESS} from "../app/constants";


export function getHomeworkStatus(gradeData, homework) {
  const {gradingProgress} = gradeData;
  return (gradingProgress === HOMEWORK_PROGRESS.fullyGraded) ? HOMEWORK_PROGRESS.fullyGraded :
    (homework.submittedOnDate) ? HOMEWORK_PROGRESS.submitted :
      (homework.beganOnDate) ? HOMEWORK_PROGRESS.inProgress :
        HOMEWORK_PROGRESS.notBegun;
}

export function calcPercentCompleted(assignment, homework) {
  if (!homework?.id || !homework?.beganOnDate) return 0;
  let maxCompletionPoints = assignment.quizQuestions.reduce((acc, q) => acc + q.progressPointsForCompleting, 0);
  let completionPoints = homework.quizAnswers.reduce((acc, answer, i) => (answer > -1) ? acc + assignment.quizQuestions[i].progressPointsForCompleting : acc, 0);
  return Math.ceil(100 * (completionPoints/maxCompletionPoints));
}

export function calcAutoScore(assignment, homework) {
  if (!homework?.id || !homework?.beganOnDate) return 0;
  return assignment.quizQuestions.reduce((acc, q, i) => {
    let points = (homework.quizAnswers[i] === q.correctAnswerIndex) ? q.gradePointsForCorrectAnswer : 0;
    return acc + points;
  }, 0)
}
