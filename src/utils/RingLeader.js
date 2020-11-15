import moment from "moment";
import { ASSIGNMENT_STATUS_TYPES, HOMEWORK_PROGRESS, ROLE_TYPES } from "../app/constants";
import aws_exports from '../aws-exports';
/*
import {
  // getDeepLinkResourceLinks as realGetDeepLinkResourceLinks,
  submitResourceSelection as realSubmitResourceSelection,
  getGrades as realGetGrades,
  getUsers as realGetUsers,
  getUnassignedStudents as realGetUnassignedStudents,
  getAssignedStudents as realGetAssignedStudents,
  submitInstructorGrade as realInstructorSubmitGrade,
  submitGrade as realAutoSubmitGrade,
  // getLineItems as realGetLineItems,
  // deleteLineItem as realDeleteLineItem,
  // hasValidSession as realHasValidSession,
} from '@asu-etx/rl-client-lib'
*/

import {
  getUsersAws as realGetUsers,
  getUnassignedStudentsAws as realGetUnassignedStudents,
  getAssignedStudentsAws as realGetAssignedStudents,
  getGradesAws as realGetGrades,
  submitInstructorGradeAws as realInstructorSubmitGrade,
  submitGradeAws as realAutoSubmitGrade,
  submitResourceSelectionAws as realSubmitResourceSelection
} from '@asu-etx/rl-client-lib';


import {
  mockGetUsers,
  mockGetAssignedStudents,
  mockGetUnassignedStudents,
  mockGetGrades,
  mockGetStudentGrade,
  mockInstructorSendGradeToLMS,
  mockAutoSendGradeToLMS,
  mockGetResourceId
} from "./MockRingLeader";



// TODO: !!!!!!!!!!!!!!!!!!!!!! Needs real code
const submitContentItem = {
  type: 'ltiResourceLink',
  label: 'name of the quiz (used in gradebook)',
  url: '', // leave null
  assignmentId: 'the actual assignment id used in my DynamoDB',
  lineItem: {
    scoreMaximum: 100,
    label: 'name of the quiz',
    assignmentId: 'the actual assignment id used in my DynamoDB - same as above',
    tag: 'not required'
  }
}

export function getResourceId(submitContentItem) {
  return (window.isDevMode) ? mockGetResourceId() : realSubmitResourceSelection(aws_exports, submitContentItem);
}


// TODO: The API needs to use the object names I have provided in the demo objects below
/**
 * Fetch students from the LMS that are in this course.
 * @param role - can be: null, "learner", "instructor"
 * @returns array of all members of the course of the given role type. No role type returns all members.
 *
 * User data will look as follows:
 *
 * class User {
    id: string | undefined; // "6281a0fe-bdba-44df-802d-27451ad14b60",
    status: string | undefined; // "Active",
    name: string | undefined; // "John Martin",
    givenName: string | undefined; // "John",
    familyName: string | undefined; // "Martin",
    email: string | undefined;// "jmartin@unicon.net",
    picture: string | undefined; // "https://canvas.instructure.com/images/messages/avatar-50.png",
    roles: [string] | undefined; // ["Learner"]
  }
 */
export function fetchUsers(role) {
  return (window.isDevMode) ? mockGetUsers(role) : realGetUsers(aws_exports, role);
}

/**
 * Fetch students that are enrolled in the given assignment.
 *
 * @param courseId - This course we want students for
 * @param assignmentId - The assignment we want find enrolled students for
 * @returns array of all members of the course of the given role type. No role type returns all members.
 *
 * NOTE: We must pass assignmentId because it is possible to enter into the app without a specific assignment id.
 *
 * class StudentUser {
    id: string | undefined; // "6281a0fe-bdba-44df-802d-27451ad14b60",
    status: string | undefined; // "Active",
    name: string | undefined; // "John Martin",
    givenName: string | undefined; // "John",
    familyName: string | undefined; // "Martin",
    email: string | undefined;// "jmartin@unicon.net",
    picture: string | undefined; // "https://canvas.instructure.com/images/messages/avatar-50.png"
  }
 */
// TODO: The API should change param order to use courseId then assignmentId
export function fetchAssignedStudents(courseId, assignmentId) {
<<<<<<< HEAD
  return (window.isDevMode) ? mockGetAssignedStudents(courseId, assignmentId) : realGetAssignedStudents(aws_exports, courseId, assignmentId);
=======
  return (window.isDevMode) ? mockGetAssignedStudents(courseId, assignmentId) : realGetAssignedStudents(courseId, assignmentId);
>>>>>>> main
}

/**
 * Fetch students that are enrolled in the given assignment.
 *
 * @param courseId - This course we want students for
 * @param assignmentId - The assignment we want to find unenrolled students for
 * @returns array of all members of the course of the given role type. No role type returns all members.
 *
 * NOTE: We must pass assignmentId because it is possible to enter into the app without a specific assignment id.
 */
// TODO: The API should change param order to use courseId then assignmentId
export function fetchUnassignedStudents(courseId, assignmentId) {
<<<<<<< HEAD
  return (window.isDevMode) ? mockGetUnassignedStudents(courseId, assignmentId) : realGetUnassignedStudents(aws_exports, courseId, assignmentId);
=======
  return (window.isDevMode) ? mockGetUnassignedStudents(courseId, assignmentId) : realGetUnassignedStudents(courseId, assignmentId);
>>>>>>> main
}


/**
 *
 * @param assignmentId
 * @param studentId
 * @returns A grade object for the student if they have been graded, otherwise null
 *
 * GradeObj {
    "studentId": "fa8fde11-43df-4328-9939-58b56309d20d",
    "score": 71,
    "comment": "Instructor comment on the student performance"
   }
 *
 * NOTE: A grade only exists for homework that has been fully graded and sent to the LMS grade book.
 */
export function fetchGradeForStudent(assignmentId, studentId) {
  if (window.isDevMode) return mockGetStudentGrade(assignmentId, studentId);

  // Temp solution until we have additional method.
  let allGrades = fetchAllGrades(assignmentId);
  return allGrades.find(g => g.studentId === studentId);

  // TODO: We need a RL method that gets a single student id. (We don't want a student to be able to fetch ids of all students)
  // return realGetStudentGrade(assignmentId, studentId);
}


/**
 *
 * @param assignmentId
 * @returns An array of grade objects, one for each homework that has been graded.
 *
 * GradeObj {
    "studentId": "fa8fde11-43df-4328-9939-58b56309d20d",
    "score": 71,
    "comment": "Instructor comment on the student performance"
   }
 *
 * NOTE: A grade only exists for homework that has been fully graded and sent to the LMS grade book.
 */
export function fetchAllGrades(assignmentId) {
<<<<<<< HEAD
  return (window.isDevMode) ? mockGetGrades(assignmentId) : realGetGrades(aws_exports, assignmentId);
=======
  return (window.isDevMode) ? mockGetGrades(assignmentId) : realGetGrades(assignmentId);
>>>>>>> main
}


/**
 *
 * @param gradeData - object containing grade submission data, described below
 * @returns {Promise<unknown>}
 *
 * SubmitGradeObj {
 *   resourceId: "9551a0fe-802d-44df-802d-27451ad14cc3", (assignmentId)
 *   studentId: "fa8fde11-43df-4328-9939-58b56309d20d",
 *   score: 100,
 *   comment: "Instructor comment on the student performance",
 *
 *   // TODO: how come we send progress values, but we can't/don't receive them?!
 *   activityProgress: "Completed", <-- optional and currently ignored
 *   gradingProgress: "FullyGraded" <-- optional and currently ignored
 * }
 */
export function sendInstructorGradeToLMS(gradeData) {
  return (window.isDevMode) ? mockInstructorSendGradeToLMS(gradeData) : realInstructorSubmitGrade(aws_exports, gradeData);
}



// TODO: Note name changes from grade to score
// Note: resourceId is NOT required in actual API, but is used by mock API
export function sendAutoGradeToLMS(assignmentId, studentId, score, comment) {
  return (window.isDevMode) ? mockAutoSendGradeToLMS(assignmentId, studentId, score, comment) :
    realAutoSubmitGrade({score, comment, gradingProgress:HOMEWORK_PROGRESS.fullyGraded});
}