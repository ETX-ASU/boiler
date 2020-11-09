import API from "@aws-amplify/api";
import {
  PUT_STUDENT_GRADE,
  GET_GRADES,
  logger,
  LTI_API_NAME
} from "@asu-etx/rl-shared";

import aws_exports from '../aws-exports';

API.configure(aws_exports);


const submitGrade = async (params) => {
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  logger.debug(`submitGrade: ${results}`);
  return results;
};

const submitInstructorGrade = async (
  params
) => {
  const data = {
    params: params
  };
  const results = await API.post(LTI_API_NAME, PUT_STUDENT_GRADE, data);
  return results;
};

const getGrades = async (assignmentId) => {
  const grades = await API.get(LTI_API_NAME, GET_GRADES, {
    lineItemId: assignmentId
  });
  return grades;
};

export { submitGrade, getGrades, submitInstructorGrade };
