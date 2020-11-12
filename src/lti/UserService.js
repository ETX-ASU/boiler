import API from "@aws-amplify/api";
import { LTI_API_NAME, ROSTER_ENDPOINT, GET_UNASSIGNED_STUDENTS_ENDPOINT, GET_ASSIGNED_STUDENTS_ENDPOINT, logger, Student } from "@asu-etx/rl-shared";
import aws_exports from '../aws-exports';
const queryString = require('query-string');
const parsed = queryString.parse(window.location.search);
API.configure(aws_exports);


const getUsers = async (role)  => {
  logger.debug(`hitting endpoint GET:${ROSTER_ENDPOINT}`);
  const users = await API.get(LTI_API_NAME, 
    `${ROSTER_ENDPOINT}?role=${role}&userId=${parsed.userId}&courseId=${parsed.courseId}`);
  return users;
};

const getUnassignedStudents = async (
  assignmentId,
  resourceLinkId
) => {
  const uanssignedStudents = await API.get(LTI_API_NAME,
    `GET_UNASSIGNED_STUDENTS_ENDPOINT
    ?userId=${parsed.userId}&courseId=${parsed.courseId}&lineItemId=${assignmentId}&resourceLinkId=${resourceLinkId}`
  );
  return uanssignedStudents;
};

const getAssignedStudents = async (
  assignmentId,
  resourceLinkId
) => {
  const uanssignedStudents = await API.get(LTI_API_NAME, GET_ASSIGNED_STUDENTS_ENDPOINT + window.location.search, {
      lineItemId: assignmentId,
      resourceLinkId: resourceLinkId,
      userId:parsed.userId,
      courseId:parsed.courseId
  });
  return uanssignedStudents;
};

export { getUsers, getUnassignedStudents, getAssignedStudents };