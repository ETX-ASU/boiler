export const APP_NAMESPACE = 'QUIZ_APP'; // Change this to name of tool
export const APP_VERSION_NUM = '0.0.2';


export const ROLE_TYPES = {
  instructor: 'instructor',
  learner: 'learner',
  dev: 'dev'
}
export const SORT_BY = {
  name: 'name',
  random: 'random',
  score: 'score',
  autoScore: 'autoScore',
  id: 'id',
  completed: 'completed',
}
export const SORT_DIRECTION = {
  ascending: 'ascending',
  descending: 'descending'
}

export const UI_SCREEN_MODES = {
  editHomework: 'UI_SCREEN_MODES.editHomework',
  reviewHomework: 'UI_SCREEN_MODES.reviewHomework',
  createOrDupeAssignment: 'UI_SCREEN_MODES.createOrDupeAssignment',
  createAssignment: 'UI_SCREEN_MODES.createAssignment',
  dupeAssignment: 'UI_SCREEN_MODES.dupeAssignment',
  viewAssignment: 'UI_SCREEN_MODES.viewAssignment',
  editAssignment: 'UI_SCREEN_MODES.editAssignment',
  devUtilityDashboard: 'UI_SCREEN_MODES.devUtilityDashboard',
  assignmentSelectorTool: 'UI_SCREEN_MODES.assignmentSelectorTool',
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

export const STATUS_TEXT = {
  'NotBegun': 'Not Begun',
  'InProgress': 'In Progress',
  'SubmittedForGrading': 'Ready to Grade',
  'FullyGraded': 'Graded',
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