import React, {Fragment} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import "./homeworks.scss";
import HeaderBar from "../../app/HeaderBar";
import {HOMEWORK_PROGRESS} from "../../app/constants";
import QuizViewerAndEditor from "../../toolDisplays/QuizViewerAndEditor";


function HomeworkViewer(props) {
	const {homework, assignment} = props;

	return (
		<Fragment>
      <HeaderBar title={assignment.title} />

      <Container className='mt-2 ml-1 mr-2'>
        <Row className={'mt-4'}>
          <Col><p>{assignment.summary}</p></Col>
        </Row>

        <QuizViewerAndEditor quizQuestions={assignment.quizQuestions} quizAnswers={homework.quizAnswers} isReadOnly={true} isShowCorrect={true} />

      </Container>
    </Fragment>
	)
}

export default HomeworkViewer;