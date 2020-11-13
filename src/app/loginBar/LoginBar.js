import React from 'react';
import {useSelector} from "react-redux";
import {APP_VERSION_NUM} from "../constants";
import "./LoginBar.css";
import {Container, Col, Row} from 'react-bootstrap';


function LoginBar() {
	const {id, givenName, familyName, activeRole} = useSelector(state => state.app.activeUser);

	const fullName = (!!id) ? `${activeRole}: ${givenName} ${familyName}` : `Logged Out`;

	return (
		<Container className='login-bar bg-white rounded xt-med xtext-med align-middle'>
			<Row className='p-2'>
				<Col className='col-5 font-weight-bold'>
					<span className='align-middle'>Dev Information Bar</span>
				</Col>
				<Col className='col-2 text-center'>
					<span className='align-middle'>
						<span className='font-weight-bold'>Quiz Tool </span><span className='xt-very-small xtext-light'>{APP_VERSION_NUM}</span>
					</span>
				</Col>
				<Col className='col-5 text-right align-middle'>
					<span className='user-name'>{fullName}</span>
				</Col>
			</Row>
		</Container>
	)
}

export default LoginBar;
