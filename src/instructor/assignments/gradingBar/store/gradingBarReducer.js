import {SORT_BY} from "../../../../app/constants";

export const TOGGLE_HIDE_STUDENT_IDENTITY = 'grading-bar.TOGGLE_HIDE_STUDENT_IDENTITY';
export const SET_GRADING_SORT_MODE = 'grading-bar.SET_GRADING_SORT_MODE';


export function toggleHideStudentIdentity(isHideStudentIdentity) {
  return {
    type: TOGGLE_HIDE_STUDENT_IDENTITY,
    isHideStudentIdentity
  }
}

export function setGradingSortMode(sortGradingBy) {
  return {
    type: SET_GRADING_SORT_MODE,
    sortGradingBy
  }
}


const defaultState = {
  isHideStudentIdentity: true,
  sortGradingBy: SORT_BY.name
};

function gradingBarReducer(currentState = defaultState, action) {
  switch (action.type) {
    case TOGGLE_HIDE_STUDENT_IDENTITY:
      return Object.assign(currentState, {isHideStudentIdentity: action.isHideStudentIdentity, sortGradingBy: SORT_BY.random});

    case SET_GRADING_SORT_MODE:
      return Object.assign(currentState, {sortGradingBy: action.sortGradingBy});

    default:
      return currentState;
  }
}

export default gradingBarReducer;