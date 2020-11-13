import React from 'react';
import {useSelector} from "react-redux";
import {UI_SCREEN_MODES} from "../app/constants";
import AssignmentViewer from "./assignments/AssignmentViewer";
import AssignmentCreator from "./assignments/AssignmentCreator";
import AssignmentNewOrDupe from "./assignments/AssignmentNewOrDupe";
import AssignmentEditor from "./assignments/AssignmentEditor";
import {Col, Container, Row} from "react-bootstrap";
import { hasValidSessionAws as hasValidSession } from '@asu-etx/rl-client-lib';
//import { hasValidSession } from '../lti/ValidateSessionService';

function InstructorDashboard() {
	const activeUiScreenMode = useSelector(state => state.app.activeUiScreenMode);

	return (
		<Container className='instructor-dashboard dashboard bg-white rounded h-100'>
			<Row className={'m-0'}>
				<Col className='rounded p-0'>
					{(activeUiScreenMode === UI_SCREEN_MODES.viewAssignment) &&
					<AssignmentViewer />
					}
					{(activeUiScreenMode === UI_SCREEN_MODES.editAssignment || activeUiScreenMode === UI_SCREEN_MODES.dupeAssignment) &&
					<AssignmentEditor />
					}
					{(activeUiScreenMode === UI_SCREEN_MODES.createOrDupeAssignment) &&
					<AssignmentNewOrDupe />
					}
					{(activeUiScreenMode === UI_SCREEN_MODES.createAssignment) &&
					<AssignmentCreator />
					}
				</Col>
			</Row>
		</Container>
	);
} 
export default hasValidSession() ? InstructorDashboard :  null;


