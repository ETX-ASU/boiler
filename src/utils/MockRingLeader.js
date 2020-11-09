import {HOMEWORK_PROGRESS, ROLE_TYPES} from "../app/constants";


const getAsyncSpecs = () => {
  return ({isMockFailureResult: Boolean((window.isMockingFailures && Math.random() * 20) < 1), mockDuration: (Math.random() * 3000) + 250})
}



export const mockGetUsers = (courseId) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by MOCKED mockGetUsers()")), mockDuration);
  } else {
    // We now take the results we expect from LMS and further message the data to fit our data model format
    let users = JSON.parse(localStorage.getItem(`boiler-course-users-${courseId}`));
    setTimeout(() => resolve(users, mockDuration));
  }
});


export const mockGetAssignedStudents = (courseId) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by MOCKED mockGetAssignedStudents()")), mockDuration);
  } else {
    // We now take the results we expect from LMS and further message the data to fit our data model format
    let users = JSON.parse(localStorage.getItem(`boiler-course-users-${courseId}`));
    let unenrolledStudentIds = new Set(JSON.parse(localStorage.getItem(`boiler-course-unenrolled-${courseId}`)));
    let students = users.filter(u => !unenrolledStudentIds.has(u.id) && u.roles.indexOf(ROLE_TYPES.instructor) < 0);
    setTimeout(() => resolve(students, mockDuration));
  }
});


export const mockGetUnassignedStudents = (courseId) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by MOCKED mockGetAssignedStudents()")), mockDuration);
  } else {
    // We now take the results we expect from LMS and further message the data to fit our data model format
    let users = JSON.parse(localStorage.getItem(`boiler-course-users-${courseId}`));
    let unenrolledStudentIds = new Set(JSON.parse(localStorage.getItem(`boiler-course-unenrolled-${courseId}`)));
    let students = users.filter(u => unenrolledStudentIds.has(u.id) && u.roles.indexOf(ROLE_TYPES.instructor) < 0);
    setTimeout(() => resolve(students, mockDuration));
  }
});



export const mockGetStudentGrade = (assignmentId, studentId) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  const userGrades = JSON.parse(localStorage.getItem(`boiler-scores-${assignmentId}`));
  let theGrade = userGrades.find(g => g.studentId === studentId);

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockGetStudentGrade()")), mockDuration);
  } else {
    setTimeout(() => resolve(theGrade, mockDuration));
  }
});


export const mockGetGrades = (assignmentId) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  let userGrades = JSON.parse(localStorage.getItem(`boiler-scores-${assignmentId}`));

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockGetStudentGrade()")), mockDuration);
  } else {
    setTimeout(() => resolve(userGrades, mockDuration));
  }
});


export const mockInstructorSendGradeToLMS = (assignmentId, gradeData) => new Promise(function (resolve, reject) {
  const {score, comment, studentId, gradingProgress} = gradeData;
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockInstructorSendGradeToLMS()")), mockDuration);
  } else {
    setTimeout(() => {
      const userGrades = JSON.parse(localStorage.getItem(`boiler-scores-${assignmentId}`));
      let gradeIndex = userGrades.findIndex(g => g.studentId === studentId);
      if (gradeIndex > -1) {
        userGrades[gradeIndex].score = score;
        userGrades[gradeIndex].comment = comment;
        userGrades[gradeIndex].gradingProgress = HOMEWORK_PROGRESS.fullyGraded;
      } else {
        userGrades.push({studentId, score, comment, gradingProgress:HOMEWORK_PROGRESS.fullyGraded});
      }

      localStorage.setItem(`boiler-scores-${assignmentId}`, JSON.stringify(userGrades));

      resolve(true, mockDuration)
    });
  }
});


export const mockAutoSendGradeToLMS = (assignmentId, studentId, score, comment) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockAutoSendGradeToLMS()")), mockDuration);
  } else {
    setTimeout(() => {
      const userGrades = JSON.parse(localStorage.getItem(`boiler-scores-${assignmentId}`));
      let gradeIndex = userGrades.findIndex(g => g.studentId === studentId);
      if (gradeIndex > -1) {
        userGrades[gradeIndex].score = score;
        userGrades[gradeIndex].comment = comment;
        userGrades[gradeIndex].gradingProgress = HOMEWORK_PROGRESS.fullyGraded;
      } else {
        userGrades.push({studentId, score, comment, gradingProgress:HOMEWORK_PROGRESS.fullyGraded});
      }

      localStorage.setItem(`boiler-scores-${assignmentId}`, JSON.stringify(userGrades));

      resolve(true, mockDuration)
    });
  }
});
