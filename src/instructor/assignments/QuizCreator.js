import React, {Fragment} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faTrash, faPlus);


function QuizCreator(props) {
  const {isUseAutoScore, setQuizQuestions} = props;

  function handleAddQuestionButton(e) {
    const quizQuestions = props.quizQuestions.slice();
    quizQuestions.push({
      questionText: '',
      answerOptions: ['', ''],
      correctAnswerIndex: 0,
      progressPointsForCompleting: 1,
      gradePointsForCorrectAnswer: (isUseAutoScore) ? 10 : 0
    });
    setQuizQuestions(quizQuestions)
  }

  function handleQuestionChange(e, qNum, propName) {
    const quizQuestions = props.quizQuestions.slice();
    quizQuestions[qNum][propName] =  e.target.value;
    setQuizQuestions(quizQuestions);
  }

  function handleCorrectAnswerSelected(e, qNum, index) {
    const quizQuestions = props.quizQuestions.slice();
    quizQuestions[qNum].correctAnswerIndex = index;
    setQuizQuestions(quizQuestions);
  }

  function handleOptionChange(e, qNum, index) {
    const quizQuestions = props.quizQuestions.slice();
    const options = quizQuestions[qNum].answerOptions.slice();
    options[index] = e.target.value;
    if ((!e.target.value) && (index-1 <= quizQuestions.length)) options.splice(index, 1);

    quizQuestions[qNum].answerOptions = options;
    setQuizQuestions(quizQuestions);
  }

  function addAnswerOpt(qNum) {
    const quizQuestions = props.quizQuestions.slice();
    quizQuestions[qNum].answerOptions = quizQuestions[qNum].answerOptions.slice();
    quizQuestions[qNum].answerOptions.push("");
    setQuizQuestions(quizQuestions);
  }

  function removeAnswerOpt(qNum, optIndex) {
    const quizQuestions = props.quizQuestions.slice();
    let correctIndex = quizQuestions[qNum].correctAnswerIndex;
    correctIndex = (correctIndex <= optIndex) ? correctIndex : correctIndex-1;
    correctIndex = Math.max(correctIndex, 0);

    quizQuestions[qNum].answerOptions.splice(optIndex, 1);
    quizQuestions[qNum].correctAnswerIndex = correctIndex;

    setQuizQuestions(quizQuestions)
  }


  function generateQuestionForm(qNum) {
    const qData = props.quizQuestions[qNum];
    return (
      <Fragment key={qNum}>
        {/* Arbitrary maximum of 3 questions per quiz for this boilerplate.*/}
        <h3 className={'subtext mt-2 mb-2'}>Question ({qNum+1} of {props.quizQuestions.length})</h3>

        <Container className='mt-4'>
          <Row className='m-2 border-bottom'>
            <Col>
              <div className='input-group w-100 pb-3'>
                <label htmlFor={`q${qNum}-prompt`} className='mr-0' style={{width:'calc(100% - 108px'}}>
                  <h3>Prompt</h3>
                  <input id={`q${qNum}-prompt`}
                         className={'form-control'}
                         onChange={e => handleQuestionChange(e, qNum, 'questionText')}
                         placeholder={`Provide text for Question #${qNum+1}`}
                         defaultValue={qData.questionText} />
                </label>

                {isUseAutoScore &&
                <label htmlFor={`q${qNum}-points`}>
                  <h3>Points</h3>
                  <input id={`q${qNum}-points`}
                         type="number"
                         className='form-control input-group-append'
                         disabled={Boolean(!isUseAutoScore)}
                         min={0} max={1000}
                         onChange={e => handleQuestionChange(e, qNum, 'gradePointsForCorrectAnswer')}
                         defaultValue={qData.gradePointsForCorrectAnswer}/>
                </label>
                }
              </div>
            </Col>
          </Row>

          <Row className='m-2'>
            <Col className={'col-12'}>
              <div className={'form-group'}>
                <label><h3>Answer Options</h3></label>
              </div>
            </Col>
          </Row>

          {qData.answerOptions.map((opt, index) =>
            <Row key={index} className='m-2 form-inline align-items-center'>
              <Col>
                <div className='input-group'>
                  <label className='ml-2 mr-2' htmlFor={`data-q${qNum}-a${index}`}><h3 className='subtext'>{index+1})</h3></label>
                  <input type='text' className='form-control' id={`data-q${qNum}-a${index}`}
                         onChange={e => handleOptionChange(e, qNum, index)} value={opt}
                         placeholder={`Answer ${index+1}`}/>
                  <div className='input-group-append'>
                    <div className='input-group-text form-control'>
                      <input className="form-check-inline" type="radio" name={`q${qNum}RadioOpts`}
                             onChange={e => handleCorrectAnswerSelected(e, qNum, index)}
                             checked={qData.correctAnswerIndex===index}/>
                      correct
                    </div>
                  </div>
                  <Button className='ml-2 btn xbg-dark'
                          disabled={qData.answerOptions.length <= 1}
                          onClick={() => removeAnswerOpt(qNum, index)}>
                    <FontAwesomeIcon className='btn-icon mr-0' icon={faTrash} />
                  </Button>
                </div>
              </Col>
            </Row>
          )}
          <Row className='m-2'>
            <Col className={'col-12 m-2 p-2 border-top'}>
              <Button className='align-middle pl-3 pr-3 xbg-dark' disabled={qData.answerOptions.length >= 5} onClick={() => addAnswerOpt(qNum)}>
                Add an option
              </Button>
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }

	return (
    <Container>
      <h2 className='mb-3'>Quiz Details</h2>
      {props.quizQuestions.map((question, qNum) => generateQuestionForm(qNum))}

      <Row className='mt-3 mb-5'>
        <Col className='text-center'>
          <h3 className={'subtext'}>
            <Button className='align-middle rounded-circle xbg-dark p-0 m-2' style={{width:'40px', height:'40px'}} onClick={handleAddQuestionButton}>
              <FontAwesomeIcon className='btn-icon mr-0' icon={faPlus} />
            </Button>
            Add another question
          </h3>
        </Col>
      </Row>
    </Container>
	)
}

export default QuizCreator;
