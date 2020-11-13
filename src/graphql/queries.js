/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAssignment = /* GraphQL */ `
  query GetAssignment($id: ID!) {
    getAssignment(id: $id) {
      id
      courseId
      resourceId
      ownerId
      title
      summary
      image
      lockOnDate
      isLockedOnSubmission
      isUseAutoScore
      isUseAutoSubmit
      quizQuestions {
        questionText
        answerOptions
        correctAnswerIndex
        progressPointsForCompleting
        gradePointsForCorrectAnswer
      }
      createdAt
      updatedAt
    }
  }
`;
export const listAssignments = /* GraphQL */ `
  query ListAssignments(
    $filter: ModelAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAssignments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        courseId
        resourceId
        ownerId
        title
        summary
        image
        lockOnDate
        isLockedOnSubmission
        isUseAutoScore
        isUseAutoSubmit
        quizQuestions {
          questionText
          answerOptions
          correctAnswerIndex
          progressPointsForCompleting
          gradePointsForCorrectAnswer
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getHomework = /* GraphQL */ `
  query GetHomework($id: ID!) {
    getHomework(id: $id) {
      id
      assignmentId
      studentOwnerId
      quizAnswers
      beganOnDate
      submittedOnDate
      isLocked
      createdAt
      updatedAt
    }
  }
`;
export const listHomeworks = /* GraphQL */ `
  query ListHomeworks(
    $filter: ModelHomeworkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listHomeworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        assignmentId
        studentOwnerId
        quizAnswers
        beganOnDate
        submittedOnDate
        isLocked
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
