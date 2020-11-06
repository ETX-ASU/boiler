export const APP_NAMESPACE = 'QUIZ_APP'; // Change this to name of tool
export const APP_VERSION_NUM = '0.0.2';

// using mock fetchActiveUserData function.
// Use 0,1 for instructors or
// 2,3,4 for students.
export const TEST_INSTRUCTOR_INDEX = 0;
export const TEST_STUDENT_INDEX = 3;

export const ROLE_TYPES = {
  instructor: 'Instructor',
  assistant: 'ASSISTANT',
  learner: 'Learner',
  guest: 'GUEST',
}
export const SORT_BY = {
  name: 'name',
  random: 'random',
  id: 'id',
  completed: 'completed',
}

export const UI_SCREEN_MODES = {
  editHomework: 'UI_SCREEN_MODES.editHomework',
  reviewHomework: 'UI_SCREEN_MODES.reviewHomework',
  createAssignment: 'UI_SCREEN_MODES.createAssignment',
  viewAssignment: 'UI_SCREEN_MODES.viewAssignment',
  editAssignment: 'UI_SCREEN_MODES.editAssignment',
}

export const ASSIGNMENT_STATUS_TYPES = {
  active: 'ACTIVE',
  archived: 'ARCHIVED'
}


// These constants listed below must match LTI constants
export const HOMEWORK_PROGRESS = {
  notBegun: 'NotBegun',
  inProgress: 'InProgress',
  submitted: 'SubmittedForGrading',
  fullyGraded: 'FullyGraded',
}

export const EMPTY_HOMEWORK = {
  id: '',
  assignmentId: '',
  studentOwnerId: '',
  quizAnswers: [],
  beganOnDate: 0,
  submittedOnDate: 0,
  isLocked: false
};

// These constants listed below must match LTI constants


/*
'FullyGraded' - The grading process is completed; the score value, if any, represents the current Final Grade;
'Pending' – Final Grade is pending, but does not require manual intervention; if a Score value is present, it indicates the current value is partial and may be updated.
'PendingManual' – Final Grade is pending, and it does require human intervention; if a Score value is present, it indicates the current value is partial and may be updated during the manual grading.
'Failed' - The grading could not complete.
'NotReady' - There is no grading process occurring; for example, the student has not yet made any submission.

 */