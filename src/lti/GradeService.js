import API from "@aws-amplify/api";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  LTI_API_NAME
} from "@asu-etx/rl-shared";
import aws_exports from '../aws-exports';
const queryString = require('query-string');
const parsed = queryString.parse(window.location.search);


API.configure(aws_exports);


const submitGrade = async (params) => {
  const data = {
    params: params,
    userId: parsed.userId,
    courseId: parsed.courseId
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE + window.location.search, data);
  logger.debug(`submitGrade: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  params
) => {
  const data = {
    params: params,
    userId: parsed.userId,
    courseId: parsed.courseId
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE + window.location.search, data);
  return results;
};

const getGrades = async (assignmentId) => {
  const grades = await API.get(LTI_API_NAME, GET_GRADES + window.location.search, {
    lineItemId: assignmentId,
    userId: parsed.userId,
    courseId: parsed.courseId
  });
  return grades;
};

export { submitGrade, getGrades, submitInstructorGrade };
