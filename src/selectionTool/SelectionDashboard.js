import React, {useEffect, useState} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {withAuthenticator} from '@aws-amplify/ui-react';
import {useDispatch, useSelector} from "react-redux";
import {Col, Container, Row} from "react-bootstrap";
import {listAssignments} from "../graphql/queries";
import AssignmentsSelectionList from "./AssignmentsSelectionList";
import {useLocation} from "react-router-dom";


function SelectionDashboard() {
  const params = new URLSearchParams(useLocation().search);
  const userId = params.get('userId');
  const courseId = params.get('courseId');
  const [assignments, setAssignments] = useState([]);
	const [isFetchingAssignments, setIsFetchingAssignments] = useState(true);

	useEffect(() => {
		fetchAssignmentList();
	}, []);


	async function fetchAssignmentList() {
	  console.log("attempting to fetchAssignmentList()");
    setIsFetchingAssignments(true);

		try {
		  let nextTokenVal = null;
		  let allAssignments = [];

      do {
        const assignmentQueryResults = await API.graphql(graphqlOperation(listAssignments,
          {filter:{ownerId:{eq:userId}, courseId:{eq:courseId}, resourceId:{eq:''}},
          nextToken: nextTokenVal
        }));
        nextTokenVal = assignmentQueryResults.data.listAssignments.nextToken;
        allAssignments.push(...assignmentQueryResults.data.listAssignments.items);
      } while (nextTokenVal);

      setAssignments(allAssignments);
      setIsFetchingAssignments(false);
		} catch (error) {
			console.warn(`=====> ERROR when fetching all assignments`, error)
		}
	}


	return (
		<Container className='student-dashboard dashboard bg-white rounded h-100 m-4 p-4'>
			<Row>
				<Col className='rounded'>
					<AssignmentsSelectionList isFetchingAssignments={isFetchingAssignments} assignments={assignments} />
				</Col>
			</Row>
		</Container>
	);
}

export default withAuthenticator(SelectionDashboard);
