import React, {Fragment} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";


function QuizViewerAndEditor(props) {
  const {quizQuestions, quizAnswers, isReadOnly, isShowCorrect, handleOptSelected} = props;


  function styleForAnswer(qNum, selectedAnswerIndex) {
    const isSelected = (quizAnswers[qNum] === selectedAnswerIndex);
    if (!isSelected) return '';
    const isCorrect = quizQuestions[qNum].correctAnswerIndex === selectedAnswerIndex;
    return (!isShowCorrect) ? 'selected' : (isCorrect) ? 'selected correct-selection' : 'selected incorrect-selection';
  }

  function isCorrectChoice(qNum, selectedAnswerIndex) {
    if (qNum === 0 && selectedAnswerIndex === 1) {
      console.log(`isCorrectChoice = ${(quizQuestions[qNum].correctAnswerIndex === selectedAnswerIndex)}`);
    }
    return (quizQuestions[qNum].correctAnswerIndex === selectedAnswerIndex);
  }

  return (
    quizQuestions.map((question, qNum) =>
      <Fragment key={qNum}>
        <Row className='mt-4'>
          <Col>
            <h3 className={'subtext mt-2 mb-3 ml-1'}>Question ({qNum+1} of {quizQuestions.length})</h3>
          </Col>
        </Row>
        <Row className='ml-3 mr-2'>
          <Col>
            <h3>Question</h3>
            <p>{question.questionText}</p>
            <h3>Your Answer</h3>
          </Col>
        </Row>
        <Row className={`ml-4 mr-2 mt-1 p-2 pt-3 xbg-light ${(isReadOnly) ? 'read-only' : ''}`}>
          {question.answerOptions.map((opt, index) =>
            <div key={index} className={`input-group mb-2 answer-opt ${styleForAnswer(qNum, index)}`}>
              <div className="input-group-prepend">
                <span className="input-group-text">{index+1}</span>
              </div>
              {isReadOnly ?
                <div className={'form-control h-auto opt-text'} aria-label={opt}>
                  {opt}
                  { (quizAnswers[qNum] === index) &&
                  <div className="input-group-append float-right">
                    {(isShowCorrect && !isCorrectChoice(qNum, index)) && <FontAwesomeIcon icon={faTimes} size='lg'/>}
                    {(!isShowCorrect || isCorrectChoice(qNum, index)) && <FontAwesomeIcon icon={faCheck} size='lg'/>}
                  </div>
                  }
                </div> :
                <div className={'form-control h-auto opt-text'} onClick={() => handleOptSelected(qNum, index)} aria-label={opt}>
                  {opt}
                  { (quizAnswers[qNum] === index) &&
                  <div className="input-group-append float-right">
                    {(isShowCorrect && !isCorrectChoice(qNum, index)) && <FontAwesomeIcon icon={faTimes} size='lg'/>}
                    {(!isShowCorrect || isCorrectChoice(qNum, index)) && <FontAwesomeIcon icon={faCheck} size='lg'/>}
                  </div>
                  }
                </div>
              }
            </div>
          )}
        </Row>
      </Fragment>
    ))
}

export default QuizViewerAndEditor;