import React, {useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuid } from "uuid";

import {HOMEWORK_PROGRESS, UI_SCREEN_MODES, EMPTY_HOMEWORK} from "../app/constants";
import {Col, Container, Row} from "react-bootstrap";
import {getHomework, listHomeworks} from "../graphql/queries";
import {createHomework} from "../graphql/mutations";
import {setActiveUiScreenMode, setGradesData, setUserHomework} from "../app/store/appReducer";
import HomeworkViewer from "./homeworks/HomeworkViewer";
import HomeworkEditor from "./homeworks/HomeworkEditor";
import {fetchStudentGradeFromLMS} from "../utils/mockRingLeaderAPIs";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {getHomeworkStatus} from "../utils/homeworkUtils";
import LoadingIndicator from "../app/assets/LoadingIndicator";
import { hasValidSession } from '@asu-etx/rl-client-lib';

function StudentDashboard() {
	const dispatch = useDispatch();
	const activeUiScreenMode = useSelector(state => state.app.activeUiScreenMode);
	const activeUser = useSelector(state => state.app.activeUser);
	const assignment = useSelector(state => state.app.assignment);

	const [homework, setHomework] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchAndSetHomework();
	}, []);


	async function fetchAndSetHomework() {
		try {
			const fetchHomeworkResult = await API.graphql(graphqlOperation(listHomeworks, {filter: {studentOwnerId: {eq:activeUser.id}, assignmentId: {eq:assignment.id}}}));
			if (!fetchHomeworkResult.data.listHomeworks.items.length) {
			  const freshHomework = Object.assign({}, EMPTY_HOMEWORK, {id: uuid(), studentOwnerId: activeUser.id, assignmentId:assignment.id, quizAnswers:Array(assignment.quizQuestions.length).fill(-1)});
        const resultHomework = await API.graphql({query: createHomework, variables: {input: freshHomework}});
        await dispatch(setUserHomework({...resultHomework.data.createHomework, instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' }, UI_SCREEN_MODES.editHomework));
      } else {
			  const resultHomework = await API.graphql(graphqlOperation(getHomework, {id:fetchHomeworkResult.data.listHomeworks.items[0].id}));
			  const theHomework = resultHomework.data.getHomework;
        let scoreData = await fetchStudentGradeFromLMS(assignment.id, activeUser.id);
        if (!scoreData) scoreData = {instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' };

        theHomework.homeworkStatus = getHomeworkStatus(scoreData, theHomework);
        await setHomework(theHomework);

        const uiMode = (theHomework.submittedOnDate) ? UI_SCREEN_MODES.reviewHomework : UI_SCREEN_MODES.editHomework;
        dispatch(setActiveUiScreenMode(uiMode));
        setIsLoading(false);
      }
		} catch (error) {
			console.warn(`=====> ERROR when fetching homeworks`, error)
		}
	}



	return (
		<Container className='student-dashboard dashboard bg-white rounded h-100 p-4'>
			<Row>
				<Col className='main-pane rounded'>
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

export default hasValidSession() ? StudentDashboard : withAuthenticator(StudentDashboard);

