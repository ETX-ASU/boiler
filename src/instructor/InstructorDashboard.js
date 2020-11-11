import React from 'react';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {useSelector} from "react-redux";
import {UI_SCREEN_MODES} from "../app/constants";
import AssignmentViewer from "./assignments/AssignmentViewer";
import AssignmentCreator from "./assignments/AssignmentCreator";
import AssignmentEditor from "./assignments/AssignmentEditor";
import {Col, Container, Row} from "react-bootstrap";
//import { hasValidSession } from '@asu-etx/rl-client-lib';
import { hasValidSession } from '../lti/ValidateSessionService';

function InstructorDashboard() {
	const activeUiScreenMode = useSelector(state => state.app.activeUiScreenMode);

	return (
		<Container className='instructor-dashboard dashboard bg-white rounded h-100 p-4'>
			<Row>
				<Col className='main-pane rounded'>
					{(activeUiScreenMode === UI_SCREEN_MODES.viewAssignment) &&
					<AssignmentViewer />
					}
					{(activeUiScreenMode === UI_SCREEN_MODES.editAssignment) &&
					<AssignmentEditor />
					}
					{(activeUiScreenMode === UI_SCREEN_MODES.createAssignment) &&
					<AssignmentCreator />
					}
				</Col>
			</Row>
		</Container>
	);
} 
export default !hasValidSession() ? InstructorDashboard : withAuthenticator(InstructorDashboard);


