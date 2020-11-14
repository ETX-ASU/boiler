import React, {useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {HOMEWORK_PROGRESS, UI_SCREEN_MODES, EMPTY_HOMEWORK} from "../app/constants";
import {Col, Container, Row} from "react-bootstrap";
import {getHomework, listHomeworks} from "../graphql/queries";
import {createHomework} from "../graphql/mutations";
import {setActiveUiScreenMode} from "../app/store/appReducer";
import HomeworkViewer from "./homeworks/HomeworkViewer";
import HomeworkEditor from "./homeworks/HomeworkEditor";
import {fetchGradeForStudent} from "../utils/RingLeader";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {getHomeworkStatus} from "../utils/homeworkUtils";
import LoadingIndicator from "../app/assets/LoadingIndicator";
import { hasValidSessionAws as hasValidSession } from '@asu-etx/rl-client-lib';
//import { hasValidSession } from '../lti/ValidateSessionService';
import aws_exports from '../aws-exports';
function StudentDashboard() {
	const dispatch = useDispatch();
	const activeUiScreenMode = useSelector(state => state.app.activeUiScreenMode);
	const activeUser = useSelector(state => state.app.activeUser);
	const assignment = useSelector(state => state.app.assignment);

	const [homework, setHomework] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
	  if (assignment.id && homework?.id) {
      setIsLoading(false);
    } else if (assignment.id) {
      fetchAndSetHomework();
    }
	}, [assignment, homework]);


	async function fetchAndSetHomework() {
		try {
			const fetchHomeworkResult = await API.graphql(graphqlOperation(listHomeworks, {filter: {"studentOwnerId":{eq:activeUser.id}, "assignmentId":{eq:assignment.id}}}));
			if (!fetchHomeworkResult.data.listHomeworks.items.length) {
			  const freshHomework = Object.assign({}, EMPTY_HOMEWORK, {id: uuid(), studentOwnerId:activeUser.id, assignmentId:assignment.id, quizAnswers:Array(assignment.quizQuestions.length).fill(-1)});
        const resultHomework = await API.graphql({query: createHomework, variables: {input: freshHomework}});
        await setHomework({...resultHomework.data.createHomework, score:0, homeworkStatus:HOMEWORK_PROGRESS.notBegun, comment:'' })
        dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.editHomework));
      } else {
			  const resultHomework = await API.graphql(graphqlOperation(getHomework, {id:fetchHomeworkResult.data.listHomeworks.items[0].id}));
			  const theHomework = resultHomework.data.getHomework;
        let scoreData = await fetchGradeForStudent(assignment.id, activeUser.id);
        if (!scoreData) scoreData = {score:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' };

        theHomework.homeworkStatus = getHomeworkStatus(scoreData, theHomework);
        await setHomework(theHomework);

        const uiMode = (theHomework.submittedOnDate) ? UI_SCREEN_MODES.reviewHomework : UI_SCREEN_MODES.editHomework;
        dispatch(setActiveUiScreenMode(uiMode));
        setIsLoading(false);
      }
		} catch (error) {
      notifyUserOfError(error);
		}
	}



	return (
    <Container className='student-dashboard dashboard bg-white rounded h-100'>
      <Row className={'m-0'}>
        <Col className='rounded p-0'>
          {isLoading && <LoadingIndicator loadingMsg='LOADING HOMEWORK'/>}

					{!isLoading && (activeUiScreenMode === UI_SCREEN_MODES.reviewHomework) &&
					<HomeworkViewer refreshHandler={fetchAndSetHomework}  assignment={assignment} homework={homework} />
					}
					{!isLoading && (activeUiScreenMode === UI_SCREEN_MODES.editHomework) &&
					<HomeworkEditor refreshHandler={fetchAndSetHomework} assignment={assignment} homework={homework} />
					}
				</Col>
			</Row>
		</Container>
	);
}

 export default !hasValidSession(aws_exports) ? StudentDashboard : null;

