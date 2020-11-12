import React from 'react';
import {Row, Col, Button} from 'react-bootstrap';


function HeaderBar(props) {
	return (
    <Row className={'screen-header-bar xbg-light'}>
      <Col className={'col-7'}><h1>{props.title}</h1></Col>
      <Col className={'col-5 text-right'}>
        <Button onClick={props.onCancel} className={'mr-2'} disabled={!props.canCancel}>Cancel</Button>
        <Button onClick={props.onSave} disabled={!props.canSave}>Save</Button>
      </Col>
    </Row>
	)
}

export default HeaderBar;
