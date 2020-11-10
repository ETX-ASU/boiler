// "Note" will become "Assignment" in Boilerplate
import {APP_NAMESPACE, UI_SCREEN_MODES} from "../constants";

export const ADD_HOMEWORKS_DATA = APP_NAMESPACE+'.ADD_HOMEWORKS_DATA';
export const SET_SESSION_DATA = APP_NAMESPACE+'.SET_SESSION_DATA';
export const UPDATE_STUDENTS_DATA = APP_NAMESPACE+'.UPDATE_STUDENTS_DATA';
export const SET_CURRENTLY_REVIEWED_STUDENT = APP_NAMESPACE+'.SET_CURRENTLY_REVIEWED_STUDENT';
export const SET_USER_HOMEWORK = APP_NAMESPACE+'.SET_USER_HOMEWORK';
export const SET_GRADES_DATA = APP_NAMESPACE+'.SET_GRADES_DATA';
// export const SET_HOMEWORK_GRADING_DATA = APP_NAMESPACE+'SET_HOMEWORK_GRADING_DATA';


export const SET_ACTIVE_USER_DATA = APP_NAMESPACE+'.SET_ACTIVE_USER_DATA';
export const SET_ACTIVE_UI_SCREEN_MODE = APP_NAMESPACE+'.SET_ACTIVE_UI_SCREEN_MODE';
export const SET_ACTIVE_ASSIGNMENT_ID = APP_NAMESPACE+'.SET_ACTIVE_ASSIGNMENT_ID';
export const SET_ACTIVE_COHORT_DATA = APP_NAMESPACE+'.SET_ACTIVE_COHORT_DATA';
export const LOGOUT_ACTIVE_USER = APP_NAMESPACE+'.LOGOUT_ACTIVE_USER';


export function setSessionData(activeUser, assignment, courseId, members) {
  return {
    type: SET_SESSION_DATA,
    activeUser,
    assignment,
    courseId,
    members
  }
}

export function setActiveUiScreenMode(activeUiScreenMode) {
  return {
    type: SET_ACTIVE_UI_SCREEN_MODE,
    activeUiScreenMode
  }
}

export function setActiveAssignmentId(activeAssignmentId) {
  return {
    type: SET_ACTIVE_ASSIGNMENT_ID,
    activeAssignmentId
  }
}

export function updateStudentsData(members) {
  return {
    type: UPDATE_STUDENTS_DATA,
    members
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

//
// export function setHomeworkGradingData(gradingData) {
//   return {
//     type: SET_HOMEWORK_GRADING_DATA,
//     gradingData
//   }
// }

export function setUserHomework(homework, activeUiScreenMode) {
  return {
    type: SET_USER_HOMEWORK,
    homework,
    activeUiScreenMode
  }
}

export function setCurrentlyReviewedStudentId(currentlyReviewedStudentId) {
  return {
    type: SET_CURRENTLY_REVIEWED_STUDENT,
    currentlyReviewedStudentId
  }
}



export function setActiveUserData(activeUser) {
  return {
    type: SET_ACTIVE_USER_DATA,
    activeUser
  }
}

export function logoutActiveUser() {
  return {
    type: LOGOUT_ACTIVE_USER
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
  activeUser: defaultUser,
  assignment: {},
  courseId: '',
  members: [],
  homeworks: [],
  // gradingData: {},
  grades: {},
  currentlyReviewedStudentId: '',
  activeUiScreenMode: UI_SCREEN_MODES.viewAssignment,
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
      // Expectation is that this is only set once when the tool is first launched/loaded.
      return Object.assign({}, currentState, {
        activeUser:action.activeUser,
        assignment:action.assignment,
        courseId:action.courseId,
        members:action.members
      });

    case UPDATE_STUDENTS_DATA:
      return Object.assign({}, currentState, {members: action.members });

    case SET_CURRENTLY_REVIEWED_STUDENT:
      return Object.assign({}, currentState, {currentlyReviewedStudentId: action.currentlyReviewedStudentId});

    case SET_USER_HOMEWORK:
      return Object.assign({}, currentState,
        {activeUser: Object.assign({}, currentState.activeUser, {homework: action.homework})},
        {activeUiScreenMode: action.activeUiScreenMode}
      );
    //
    // case SET_HOMEWORK_GRADING_DATA:
    //   return Object.assign({}, currentState, {gradingData: action.gradingData});


    case SET_ACTIVE_USER_DATA:
      if (!action.activeUser.assignmentId) {
        return Object.assign({}, currentState, {activeUser:action.activeUser, entryAssignmentId:null, activeUiScreenMode: UI_SCREEN_MODES.createAssignment})
      }
      return Object.assign({}, currentState, {activeUser:action.activeUser, entryAssignmentId:action.activeUser.assignmentId})

    case LOGOUT_ACTIVE_USER:
      return Object.assign({}, currentState, {activeUser: defaultUser});

    case SET_ACTIVE_COHORT_DATA:
      return Object.assign({}, currentState, {activeCohortData: action.activeCohortData});

    default:
      return currentState;
  }
}

export default appReducer;