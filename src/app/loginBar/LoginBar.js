import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {logoutActiveUser} from "../store/appReducer";
import {APP_VERSION_NUM} from "../constants";
import "./LoginBar.css";
import { Auth } from 'aws-amplify';
import {Container, Col, Row, Button} from 'react-bootstrap';


function LoginBar() {
	const dispatch = useDispatch();
	const {id, givenName, familyName, activeRole} = useSelector(state => state.app.activeUser);

	const handleSignOut = async () => {
		try {
			await Auth.signOut();
			await dispatch(logoutActiveUser());
			console.log('Signed out');
		} catch (error) {
			console.error('Error signing out user ', error)
		}
	}

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
					<span className='text-right'>
						{!!id && <Button className='btn-sm xbg-darkest ml-4' onClick={handleSignOut}>Sign out</Button>}
						{!id && <Button className='btn-sm xbg-darkest ml-4' onClick={() => window.location.reload(true)}>Sign In</Button>}
					</span>
				</Col>
			</Row>
		</Container>

	)
}

export default LoginBar;
