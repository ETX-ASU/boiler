import React, {useEffect} from 'react';
import './App.scss';
import {API, graphqlOperation} from "aws-amplify";

import {useDispatch, useSelector} from "react-redux";

import { setActiveUiScreenMode, setSessionData, setAssignmentData } from "./store/appReducer";
import {HOMEWORK_PROGRESS, ROLE_TYPES, UI_SCREEN_MODES} from "./constants";
import {Container, Row} from "react-bootstrap";
import InstructorDashboard from "../instructor/InstructorDashboard";
import StudentDashboard from "../student/StudentDashboard";
import LoadingIndicator from "./assets/LoadingIndicator";
import {useLocation} from "react-router-dom";
import {getAssignment} from "../graphql/queries";
import {shuffle} from "../utils/shuffle";
import DevUtilityDashboard from "../devUtility/DevUtilityDashboard";

import {createMockCourseMembers} from "../utils/MockRingLeader";
import {fetchUsers, hasValidSession} from "../utils/RingLeader";
import aws_exports from '../aws-exports';
import SelectionDashboard from "../selectionTool/SelectionDashboard";



function App() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser);
  const assignmentId = useSelector(state => state.app.assignmentId);
  const params = new URLSearchParams(useLocation().search);
  const mode = params.get('mode');

  useEffect(() => {
    console.log(`------------ initialize`);
    const userIdParam = params.get('userId');
    const activeRoleParam = params.get('role');
    const assignmentIdParam = params.get('assignmentId');
    const courseIdParam = params.get('courseId');
    const mode = params.get('mode');

    console.warn(`uId, role, resId, cId: ${userIdParam} | ${activeRoleParam} | ${assignmentIdParam} | ${courseIdParam}`)

    /**
     * This initializes the redux store with courseId, assignmentId, activeUser data,
     * members data for members in this course.
     *
     * @param courseId - should not change once set
     * @param assignmentId - may only change from null to an existing resource in the DB
     * @param userId - should not change once set
     * @param activeRole - for now, should not change once set
     * @returns nothing. It simply updates redux store with initial session data.
     *
     */
    async function initializeSessionData(courseId, assignmentId, userId, activeRole) {
      try {
        let members = await fetchUsers(courseId);
        const activeUser = members.find(m => m.id === userId);
        activeUser.activeRole = activeRole;
        if (!activeUser) {
          window.confirm(`We're sorry. Initialization of session data failed because no matching user was found.`);
        }

        if (activeUser.activeRole === ROLE_TYPES.learner) {
          dispatch(setSessionData(courseId, assignmentId, activeUser, []));
          return;
        }

        // ActiveUser is an instructor, so save data about all students in the course, and create default homework data values for them
        let studentsOnly = members.filter(m => m.roles.indexOf(ROLE_TYPES.learner) > -1);
        let positions = shuffle(studentsOnly.map((h, i) => i+1));
        let students = studentsOnly.map((s,i) => (
          {...s, randomOrderNum:positions[i], homework:{percentCompleted:0, beganOnDate:0, autoScore:0, progress:HOMEWORK_PROGRESS.notBegun}}
        ));

        dispatch(setSessionData(courseId, assignmentId, activeUser, students));
      } catch (error) {
        console.error(" -------------> CHECK devMode. In local env should be set to true.", error);
        window.confirm(`We're sorry. There was an error initializing session data. Please wait a moment and try again. Error: ${error}`);
      }
    }

    if (activeRoleParam === ROLE_TYPES.dev && !window.isDevMode) { throw new Error("Can NOT use dev role when not in DevMode. Set DevMode to true in codebase.") }
    if (!assignmentIdParam && activeRoleParam === ROLE_TYPES.learner) { throw new Error("User role of student trying to access app with no assignmentId value.") }

    if (mode === 'selectAssignment') dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.assignmentSelectorTool));

    // TODO: Comment this out for LIVE deployment.
    // IF in DEV mode, and mock data doesn't exist for provided courseId, this creates mock students and instructors for the course
    // Required params: role=dev, userId=any, courseId=any, assignmentId=null or existing assignment id
    if (window.isDevMode) createMockCourseMembers(courseIdParam, 80);

    if (mode !== 'selectAssignment') initializeSessionData(courseIdParam, assignmentIdParam, userIdParam, activeRoleParam);
	}, []);


  /**
   * If the assignmentId changes, we need to fetch data about students associated with the current assignment
   * and fetch homework associated with each student
   */
	useEffect(() => {
    console.log(`------------ assignmentId changed to: ${assignmentId}`);
	  if (assignmentId && activeUser.id) {
	    initializeAssignmentAndHomeworks()
    }

    if (!assignmentId && activeUser.id) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createOrDupeAssignment));
    } else if (activeUser.activeRole === ROLE_TYPES.dev) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.devUtilityDashboard));
    } else {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
    }
  }, [assignmentId, activeUser])



	async function initializeAssignmentAndHomeworks() {
		try {
      const assignmentQueryResults = await API.graphql(graphqlOperation(getAssignment, {id:assignmentId}));
      const assignment = assignmentQueryResults.data.getAssignment;
      if (!assignment?.id) window.confirm(`We're sorry. There was an error fetching the assignment. Provided assignmentId from URL strand does not match any existing DB assignment.`);
      dispatch(setAssignmentData(assignment));
		} catch (error) {
      window.confirm(`We're sorry. There was an error fetching the assignment and associated student work. Please wait a moment and try again. Error: ${error}`);
		}
	}

	if (mode === 'selectAssignment') return (
    <Container className="app mt-4 mb-2 p-0">
      <Row className='main-content-row'>
        <SelectionDashboard />
      </Row>
    </Container>
  )

	return (
		<Container className="app mt-4 mb-5 p-0">
			<Row className='main-content-row'>
				{!activeUser?.id && <LoadingIndicator msgClasses='xtext-white' loadingMsg='LOADING'/>}
				{activeUser.activeRole === ROLE_TYPES.dev && <DevUtilityDashboard />}
				{activeUser.activeRole === ROLE_TYPES.instructor && <InstructorDashboard />}
				{activeUser.activeRole === ROLE_TYPES.learner && <StudentDashboard />}
			</Row>
		</Container>
	);
}
export default hasValidSession(aws_exports) ? App :  null;
