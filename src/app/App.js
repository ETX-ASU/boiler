import React, {useEffect} from 'react';
import './App.scss';
import {API, graphqlOperation} from "aws-amplify";

import { hasValidSessionAws as hasValidSession } from '@asu-etx/rl-client-lib';
//import { hasValidSession } from '../lti/ValidateSessionService';
import {useDispatch, useSelector} from "react-redux";

import { setActiveUiScreenMode, setSessionData } from "./store/appReducer";
import {HOMEWORK_PROGRESS, ROLE_TYPES, UI_SCREEN_MODES} from "./constants";
import LoginBar from "./loginBar/LoginBar";
import {Container, Row} from "react-bootstrap";
import InstructorDashboard from "../instructor/InstructorDashboard";
import StudentDashboard from "../student/StudentDashboard";
import LoadingIndicator from "./assets/LoadingIndicator";
import {useLocation} from "react-router-dom";

import {getAssignment} from "../graphql/queries";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {shuffle} from "../utils/shuffle";
import DevUtilityDashboard from "../devUtility/DevUtilityDashboard";

import {createMockCourseMembers} from "../utils/MockRingLeader";
import {fetchUsers} from "../utils/RingLeader";
import aws_exports from '../aws-exports';

function App() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser);
  const params = new URLSearchParams(useLocation().search);
  const userId = params.get('userId');
  const activeRole = params.get('role');

  const assignmentId = params.get('resourceId');
  const courseId = params.get('courseId');

	useEffect(() => {
    if (activeRole === ROLE_TYPES.dev && !window.isDevMode) { throw new Error("Can NOT use dev role when not in DevMode. Set DevMode to true in codebase.") }
    if (!assignmentId && activeRole === ROLE_TYPES.learner) { throw new Error("User role of student trying to access app with no assignmentId value.") }

    // TODO: Comment this out for LIVE deployment.
    // IF in DEV mode, and mock data doesn't exist for provided courseId, this creates mock students and instructors for the course
    // Required params: role=dev, userId=any, courseId=any, assignmentId=null or existing assignment id
    if (window.isDevMode) createMockCourseMembers(courseId, 20);

    fetchAndSetAssignmentAndMembers();

    if (!assignmentId) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createOrDupeAssignment));
    } else if (activeRole === ROLE_TYPES.dev) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.devUtilityDashboard));
    } else {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
    }
	}, []);


	async function fetchAndSetAssignmentAndMembers() {
		try {
		  // TODO: Perhaps need to refactor to fetch singleMember data? Then, if instructor, then get the other data.
      // TODO: Yeah. Rethink this. I think we can get user data up front. Determine the user role, then fetch based on that info
			const members = await fetchUsers(courseId);
      const activeUser = members.find(m => m.id === userId);
      activeUser.activeRole = activeRole;

      if (!assignmentId) {
        dispatch(setSessionData(activeUser, {}, courseId, members));
        return;
      }

      // Generate default student homework data for every student. Later, existing homework data fetched from DB will overwrite default values.
      let students = members.filter(m => m.roles.indexOf(ROLE_TYPES.learner) > -1);
      let positions = shuffle(students.map((h, i) => i+1));
      students = students.map((s,i) => (
        {...s, randomOrderNum:positions[i], homework:{percentCompleted:0, beganOnDate:0, autoScore:0, progress:HOMEWORK_PROGRESS.notBegun}}
      ));

      const assignmentQueryResults = await API.graphql(graphqlOperation(getAssignment, {id:assignmentId}));
      const assignment = assignmentQueryResults.data.getAssignment;

      // Do NOT store fellow student data if this is NOT an instructor
      if (activeRole === ROLE_TYPES.learner) students = [];
      dispatch(setSessionData(activeUser, assignment, courseId, students));
		} catch (error) {
      notifyUserOfError(error)
		}
	}


	return (
		<Container className="app mt-4 mb-2 p-0">
			{/*<Row className="mb-3">*/}
			{/*	<LoginBar activeUser={activeUser} />*/}
			{/*</Row>*/}

			<Row className='main-content-row'>
				{!activeUser?.id && <LoadingIndicator msgClasses='xtext-white' loadingMsg='LOADING ASSIGNMENTS'/>}
				{activeUser.activeRole === ROLE_TYPES.dev && <DevUtilityDashboard />}
				{activeUser.activeRole === ROLE_TYPES.instructor && <InstructorDashboard />}
				{activeUser.activeRole === ROLE_TYPES.learner && <StudentDashboard />}
			</Row>
		</Container>
	);
}
export default hasValidSession(aws_exports) ? App :  null;
