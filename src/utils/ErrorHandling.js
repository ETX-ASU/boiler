import {setModalData, setModalVisibility} from "../app/store/modalReducer";
import React, {Fragment} from "react";
import {Button} from "react-bootstrap";
import {useDispatch} from "react-redux";

export function logError(error) {
  console.warn(error);
}