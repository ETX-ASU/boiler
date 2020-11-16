import {useDispatch} from "react-redux";
import {setModalData, setModalVisibility} from "./store/modalReducer";
import React, {Fragment} from "react";
import {Button} from "react-bootstrap";

export function ErrorHandler(msg, error) {
  const dispatch = useDispatch();

  dispatch(setModalData({
    isShown: true,
    title: 'Cancel Edits Warning',
    prompt: (
      <Fragment>
        <p>Do you want to cancel new assignment or continue editing?</p>
        <p>Canceling will not save your new assignment.</p>
      </Fragment>
    ),
    buttons: (
      <Fragment>
        <Button onClick={closeModalAndReturnToViewScreen}>Cancel</Button>
        <Button onClick={() => dispatch(setModalVisibility(false))}>Continue editing</Button>
      </Fragment>
    )
  }));
  alert(error);
}

export default ErrorHandler;