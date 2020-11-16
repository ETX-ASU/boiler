import React from "react";
import {Modal, ModalDialog, ModalBody, ModalFooter, Button} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {useDispatch, useSelector} from "react-redux";
import {setModalVisibility} from "./store/modalReducer";



function ConfirmationModal() {
  const dispatch = useDispatch();
  const modal = useSelector(state => state.modal);
  const {prompt, title, isShown, buttons} = modal;

  function handleCloseModal() {
    console.log('handleCloseModal()');
    dispatch(setModalVisibility(false));
  }

  return(
    <Modal show={isShown}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{prompt}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        {buttons}
      </Modal.Footer>
    </Modal>
  )


  // return (
  //   <Modal isOpen={isOpen} toggle={cancelFunc} className='modal-dialog modal-dialog-centered' tabIndex="-1" role="dialog">
  //     <div className={`modal-header bg-${modalDisplayType}`}>
  //       <h5 className="modal-title">{title}</h5>
  //       <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={cancelFunc} disabled={isAwaitingResults}>
  //         <span aria-hidden="true">&times;</span>
  //       </button>
  //     </div>
  //     <div className="modal-body">
  //       <p>{message}</p>
  //       {errorMessage && <p className={'text-danger'}>{errorMessage}</p>}
  //     </div>
  //     <div className="modal-footer">
  //       {proceedLabel && <button type="button" className={`btn btn-${modalDisplayType}`} disabled={isAwaitingResults} onClick={proceedFunc}>{proceedLabel}</button>}
  //       <button type="button" className={`btn btn-secondary`} onClick={cancelFunc} data-dismiss="modal" disabled={isAwaitingResults}>{cancelLabel}</button>
  //     </div>
  //   </Modal>
  // )
}

export default ConfirmationModal;
