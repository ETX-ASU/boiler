import React, {useEffect} from 'react';
import './App.scss';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {useDispatch, useSelector} from "react-redux";

import {
  createMockLmsData, fetchMembersAndContextFromLms,
  // mockedFetchActiveUserSessionData as fetchActiveUserSessionData,
} from "../utils/mockRingLeaderAPIs";
import {
  setActiveUiScreenMode,
  setActiveUserData, setAssignments, setSessionData
} from "./store/appReducer";
import {HOMEWORK_PROGRESS, ROLE_TYPES, UI_SCREEN_MODES} from "./constants";
import LoginBar from "./loginBar/LoginBar";
import {Container, Row} from "react-bootstrap";
import InstructorDashboard from "../instructor/InstructorDashboard";
import StudentDashboard from "../student/StudentDashboard";
import LoadingIndicator from "./assets/LoadingIndicator";
import {useParams, useLocation} from "react-router-dom";
import {API, graphqlOperation} from "aws-amplify";
import {getAssignment} from "../graphql/queries";
import {notifyUserOfError} from "../utils/ErrorHandling";
import {shuffle} from "../utils/shuffle";


// using mock fetchActiveUserData function.
// Use 0,1 for instructors or
// 2,3,4 for members.
// const TEST_USER_ID = 0;

// using "sportzball" assignment id or null for testing
// const TEST_ASSIGNMENT_ID = "751cf7a7-ad71-4ced-8c2a-cd584add5473";

function App() {
	const dispatch = useDispatch();
	const activeUser = useSelector(state => state.app.activeUser);
  const params = new URLSearchParams(useLocation().search);
  const userId = params.get('userId');
  const assignmentId = params.get('resourceId');

	useEffect(() => {
    // TODO: Delete this for LIVE deployment.
	  if (!localStorage.getItem('mockScoresFromLms')) createMockLmsData();

    fetchAssignmentAndMembersData(userId, assignmentId);

    if (!assignmentId) {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.createAssignment));
    } else {
      dispatch(setActiveUiScreenMode(UI_SCREEN_MODES.viewAssignment));
    }
	}, []);

	async function fetchAssignmentAndMembersData(userId, assignmentId) {
		try {
		  // TODO: Perhaps need to refactor to fetch singleMember data? Then, if instructor, then get the other data.
      // TODO: Yeah. Rethink this. I think we can get user data up front. Determine the user role, then fetch based on that info
			const {members, context} = await fetchMembersAndContextFromLms(assignmentId);
      const activeUser = members.find(m => m.id === userId);

      if (!assignmentId) {
        activeUser.activeRole = ROLE_TYPES.instructor;
        dispatch(setSessionData(activeUser, {}, context, members));
        return;
      }

      let students = members.filter(m => m.roles.indexOf(ROLE_TYPES.learner) > -1);
      let positions = shuffle(students.map((h, i) => i+1));
      students = students.map((s,i) => (
        {...s, randomOrderNum:positions[i], homework:{percentCompleted:0, beganOnDate:0, autoScore:0, progress:HOMEWORK_PROGRESS.notBegun}}
      ));

      const assignmentQueryResults = await API.graphql(graphqlOperation(getAssignment, {id:assignmentId}));
      const assignment = assignmentQueryResults.data.getAssignment;
      activeUser.activeRole = determineUserRole(assignment, activeUser);

      // Do NOT store fellow student data if this is NOT an instructor
      if (activeUser.activeRole !== ROLE_TYPES.instructor) students = [];
      dispatch(setSessionData(activeUser, assignment, context, students));
		} catch (error) {
      notifyUserOfError(error)
		}
	}

	function determineUserRole(assignment, user) {
    let role = ROLE_TYPES.learner;
    if (user.roles.indexOf(ROLE_TYPES.instructor) > -1 && assignment?.ownerId === user.id) role = ROLE_TYPES.instructor;
    if (role !== ROLE_TYPES.instructor && assignment.ownerId === user.id) throw new Error('User IS owner of this Assignment, but user is NOT an instructor');
    return role;
  }

	return (
		<Container className="app mt-4 mb-2 p-0">
			<Row className="mb-3">
				<LoginBar activeUser={activeUser} />
			</Row>

			<Row className='main-content-row'>
				{!activeUser?.id && <LoadingIndicator msgClasses='xtext-white' loadingMsg='LOADING ASSIGNMENTS'/>}
				{activeUser.activeRole === ROLE_TYPES.instructor && <InstructorDashboard />}
				{activeUser.activeRole === ROLE_TYPES.learner && <StudentDashboard />}
			</Row>
		</Container>
	);
}

export default withAuthenticator(App);
