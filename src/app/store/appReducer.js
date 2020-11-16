import {APP_NAMESPACE, UI_SCREEN_MODES} from "../constants";

export const SET_SESSION_DATA = APP_NAMESPACE+'.SET_SESSION_DATA';
export const SET_ASSIGNMENT_DATA = APP_NAMESPACE+'.SET_ASSIGNMENT_DATA';
export const SET_DISPLAY_ORDER = APP_NAMESPACE+'.SET_DISPLAY_ORDER';
export const SET_CURRENTLY_REVIEWED_STUDENT_ID = APP_NAMESPACE+'.SET_CURRENTLY_REVIEWED_STUDENT_ID';
export const SET_GRADES_DATA = APP_NAMESPACE+'.SET_GRADES_DATA';
export const SET_ACTIVE_UI_SCREEN_MODE = APP_NAMESPACE+'.SET_ACTIVE_UI_SCREEN_MODE';
export const EDIT_DUPED_ASSIGNMENT = APP_NAMESPACE+'.EDIT_DUPED_ASSIGNMENT';
export const ADD_HOMEWORKS_DATA = APP_NAMESPACE+'.ADD_HOMEWORKS_DATA';


export function setSessionData(courseId, assignmentId, activeUser, members) {
  return {
    type: SET_SESSION_DATA,
    courseId,
    assignmentId,
    activeUser,
    members
  }
}

export function setAssignmentData(assignment) {
  return {
    type: SET_ASSIGNMENT_DATA,
    assignment
  }
}

export function editDupedAssignment(assignment) {
  return {
    type: EDIT_DUPED_ASSIGNMENT,
    assignment
  }
}

export function setActiveUiScreenMode(activeUiScreenMode) {
  return {
    type: SET_ACTIVE_UI_SCREEN_MODE,
    activeUiScreenMode
  }
}

export function addHomeworksData(homeworks) {
  return {
    type: ADD_HOMEWORKS_DATA,
    homeworks
  }
}

export function setGradesData(grades) {
  return {
    type: SET_GRADES_DATA,
    grades
  }
}

export function setDisplayOrder(displayOrder) {
  return {
    type: SET_DISPLAY_ORDER,
    displayOrder
  }
}

export function setCurrentlyReviewedStudentId(currentlyReviewedStudentId) {
  return {
    type: SET_CURRENTLY_REVIEWED_STUDENT_ID,
    currentlyReviewedStudentId
  }
}



const defaultState = {
  courseId: '',
  assignmentId: '',
  activeUser: {
    id: '',
    givenName: '',
    familyName: '',
    email: '',
    activeRole: '',
    roles: []
  },
  assignment: {},
  members: [],
  homeworks: [],
  grades: {},
  currentlyReviewedStudentId: '',
  activeUiScreenMode: '',
  displayOrder: []
}


function appReducer(currentState = defaultState, action) {
  switch (action.type) {
    case SET_ACTIVE_UI_SCREEN_MODE:
      return Object.assign({}, currentState, {activeUiScreenMode: action.activeUiScreenMode});

    case SET_GRADES_DATA:
      return Object.assign({}, currentState, {grades: action.grades});

    case ADD_HOMEWORKS_DATA:
      return Object.assign({}, currentState, {homeworks:[...currentState.homeworks, ...action.homeworks]});

    case SET_SESSION_DATA:
      return Object.assign({}, currentState, {
        activeUser:action.activeUser,
        assignmentId:action.assignmentId,
        courseId:action.courseId,
        members:action.members
      });

    case EDIT_DUPED_ASSIGNMENT:
      return Object.assign({}, currentState, {assignment: action.assignment, activeUiScreenMode: UI_SCREEN_MODES.dupeAssignment})

    case SET_CURRENTLY_REVIEWED_STUDENT_ID:
      return Object.assign({}, currentState, {currentlyReviewedStudentId: action.currentlyReviewedStudentId});

    case SET_ASSIGNMENT_DATA:
      return Object.assign({}, currentState, {assignment: action.assignment});

    case SET_DISPLAY_ORDER:
      return Object.assign({}, currentState, {displayOrder: action.displayOrder});

    default:
      return currentState;
  }
}

export default appReducer;