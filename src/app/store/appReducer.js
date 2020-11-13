// "Note" will become "Assignment" in Boilerplate
import {APP_NAMESPACE, UI_SCREEN_MODES} from "../constants";

export const SET_SESSION_DATA = APP_NAMESPACE+'.SET_SESSION_DATA';
export const SET_ASSIGNMENT_DATA = APP_NAMESPACE+'.SET_ASSIGNMENT_DATA';

export const SET_CURRENTLY_REVIEWED_STUDENT = APP_NAMESPACE+'.SET_CURRENTLY_REVIEWED_STUDENT';
export const SET_GRADES_DATA = APP_NAMESPACE+'.SET_GRADES_DATA';

export const SET_ACTIVE_UI_SCREEN_MODE = APP_NAMESPACE+'.SET_ACTIVE_UI_SCREEN_MODE';

export const EDIT_DUPED_ASSIGNMENT = APP_NAMESPACE+'.EDIT_DUPED_ASSIGNMENT';
export const ADD_HOMEWORKS_DATA = APP_NAMESPACE+'.ADD_HOMEWORKS_DATA';


// export function setSessionData(activeUser, assignment, courseId, members)
export function setSessionData(courseId, resourceId, activeUser, members) {
  return {
    type: SET_SESSION_DATA,
    courseId,
    resourceId,
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

export function setCurrentlyReviewedStudentId(currentlyReviewedStudentId) {
  return {
    type: SET_CURRENTLY_REVIEWED_STUDENT,
    currentlyReviewedStudentId
  }
}



const defaultUser = {
  id: '',
  givenName: '',
  familyName: '',
  email: '',
  activeRole: '',
  roles: []
};

const defaultState = {
  courseId: '',
  resourceId: '',
  activeUser: defaultUser,
  assignment: {},
  members: [],
  homeworks: [],
  grades: {},
  currentlyReviewedStudentId: '',
  activeUiScreenMode: '',
}

/*

Refactor of Redux Store:

// EXTERNALLY PERSISTED DATA
activeUser:
  - loaded once, on launch. No sign in/sign out. That is essentially handled by launching/closing app.
context:
  - Same as activeUser. Loaded once, on Launch
assignment:
  - If it exists, it is loaded once on launch.
  - If no assignment exists, left empty and created in DB. Then loaded once after creation.
members:
  - Loaded once, on launch. Then filtered to remove the activeUser and any non-members.
  - (For functionality, if you have a student role, you can have homework.)
gradingData:
  - loaded on launch.
  - Re-fetched/Updated when instructor submits a grade to the LMS
    - Should probably re-fetch a single student grade instead of entire class
homeworks:
  - Loaded on launch.
  - Perhaps a refresh button so the instructor can check for recently submitted homework? (That is, if the
  instructor has been grading for an hour, they could hit refresh in order to see if new student work or changes
  have been submitted during this time?)

// LOCAL DATA
currentlyReviewedStudentId:
  - set initially to null
  - changed frequently by app due to navigation
activeUiScreenMode:
  - set initially
  - changed frequently by app due to navigation


 */


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
        resourceId:action.resourceId,
        courseId:action.courseId,
        members:action.members
      });

    case EDIT_DUPED_ASSIGNMENT:
      return Object.assign({}, currentState, {assignment: action.assignment, activeUiScreenMode: UI_SCREEN_MODES.dupeAssignment})

    case SET_CURRENTLY_REVIEWED_STUDENT:
      return Object.assign({}, currentState, {currentlyReviewedStudentId: action.currentlyReviewedStudentId});

    case SET_ASSIGNMENT_DATA:
      return Object.assign({}, currentState, {assignment: action.assignment});


    default:
      return currentState;
  }
}

export default appReducer;