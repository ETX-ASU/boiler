/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAssignment = /* GraphQL */ `
  subscription OnCreateAssignment {
    onCreateAssignment {
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
export const onUpdateAssignment = /* GraphQL */ `
  subscription OnUpdateAssignment {
    onUpdateAssignment {
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
export const onDeleteAssignment = /* GraphQL */ `
  subscription OnDeleteAssignment {
    onDeleteAssignment {
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
export const onCreateHomework = /* GraphQL */ `
  subscription OnCreateHomework {
    onCreateHomework {
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
export const onUpdateHomework = /* GraphQL */ `
  subscription OnUpdateHomework {
    onUpdateHomework {
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
export const onDeleteHomework = /* GraphQL */ `
  subscription OnDeleteHomework {
    onDeleteHomework {
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
