import React from "react";
import {Fragment} from "react";

export const MODAL_STYLES = {
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  plain: 'secondary'
};

export const SET_MODAL_IS_SHOWN = 'SET_MODAL_IS_SHOWN';
export const SET_MODAL_DATA = 'SET_MODAL_DATA';
export const SET_MODAL_BUTTONS = 'SET_MODAL_BUTTONS';
export const SET_ERROR = 'SET_ERROR';

export function setModalVisibility(isShown) {
  return {
    type: SET_MODAL_IS_SHOWN,
    isShown
  }
}


export function setModalData(data) {
  return {
    type: SET_MODAL_DATA,
    data
  }
}

export function setModalButtons(buttons) {
  return {
    type: SET_MODAL_BUTTONS,
    buttons
  }
}

const defaultState = {
  title: '',
  isShown: false,
  prompt: '',
  buttons: ''
};

function modalReducer(currentState = defaultState, action) {
  switch (action.type) {
    case SET_MODAL_IS_SHOWN:
      return Object.assign({}, currentState, {isShown: action.isShown});

    case SET_MODAL_DATA:
      return Object.assign({}, currentState, {...action.data});

    case SET_MODAL_BUTTONS:
      return Object.assign({}, currentState, {buttons:action.buttons});

    default:
      return currentState;
  }
}

export default modalReducer;