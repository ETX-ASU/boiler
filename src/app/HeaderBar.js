import React, {Fragment} from 'react';
import {Alert, Row, Col, Button} from 'react-bootstrap';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {library} from "@fortawesome/fontawesome-svg-core";
import { faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons'
library.add(faExclamationTriangle, faTrash);


function HeaderBar(props) {
	return (
	  <Fragment>
      <Row className={'screen-header-bar xbg-light'}>
        <Col className={'col-7'}><h1>{props.title}</h1></Col>
        <Col className={'col-5 text-right'}>
          <Button onClick={props.onCancel} className={'mr-2'} disabled={!props.canCancel}>Cancel</Button>
          <Button onClick={props.onSave} disabled={!props.canSave}>Save</Button>
        </Col>
      </Row>
      {props.isLimitedEditing &&
        <Row className='m-4 p-0 alert alert-warning' role='alert'>
          <Col className={'alert-block p-3 text-center'}>
            <FontAwesomeIcon icon={faExclamationTriangle} size='2x' inverse/>
          </Col>
          <Col className='col-10'>
            <p className='m-3'>Students have begun their assignment, therefore some options can no longer be changed and are disabled.</p>
          </Col>
        </Row>
      }
    </Fragment>
	)
}

export default HeaderBar;
