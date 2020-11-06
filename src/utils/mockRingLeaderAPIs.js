import moment from "moment";
import {
  ASSIGNMENT_STATUS_TYPES,
  HOMEWORK_PROGRESS,
  ROLE_TYPES
} from "../app/constants";


// Results from attempt to fetches all members (students & instructors) associated with this COURSE
// This probably needs to instead by changed to provide the ASSIGNMENT context
const mockMembersAndContextFromLms = {
  id: "https://unicon.instructure.com/api/lti/courses/786/names_and_roles?role=http%3A%2F%2Fpurl.imsglobal.org%2Fvocab%2Flis%2Fv2%2Fmembership%23Learner",
  context: {
    id: "lms-course-id-abc1234",
    label: "Fake Course Label",
    title: "Fake Course Title"
  },
  members: [
    { id:"user-id-uncle-bob", status:"Active", name:"Uncle Bob McBobberton", givenName:"Bob", familyName:"McBobberton", email:"UncleBob@FakeSchool.com", roles: ["Instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    { id:"user-id-freddy-mcfreaky", status:"Active", name:"Freddy McFreaky", givenName:"Freddy", familyName:"McFreaky", email:"FMcFreaky@yahoo.com", roles: ["Instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    { id:"10", status:"Active", name:"Annie Arg", givenName:"Annie", familyName:"Arg", email:"AnnieArg@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"11", status:"Active", name:"Bobby Blah", givenName:"Bobby", familyName:"Blah", email:"BobbyBlah@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"12", status:"Active", name:"Chris Crumb", givenName:"Chris", familyName:"Crumb", email:"ChrisCrumb@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"13", status:"Active", name:"Danny Dumpsterfire", givenName:"Danny", familyName:"Dumpsterfire", email:"DannyDumpsterfire@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"14", status:"Active", name:"Eddie Erg", givenName:"Eddie", familyName:"Erg", email:"EddieErg@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"20", status:"Active", name:"Zack McZack", givenName:"Zack", familyName:"McZack", email:"Zack@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"21", status:"Active", name:"Yosif Yodell", givenName:"Yosif", familyName:"Yodell", email:"Yosif@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"22", status:"Active", name:"Xerxes McX", givenName:"Xerxes", familyName:"McX", email:"Xerxes@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"23", status:"Active", name:"Wanda McWaWah", givenName:"Wanda", familyName:"McWaWah", email:"Wanda@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"24", status:"Active", name:"Vernon Velociraptor", givenName:"Vernon", familyName:"Velociraptor", email:"Vernon@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"25", status:"Active", name:"Ungar McUngar", givenName:"Ungar", familyName:"McMcUngar", email:"Ungar@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"30", status:"Active", name:"Anaconda McAnaconda", givenName:"Anaconda", familyName:"McAnaconda", email:"Apocalypse@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"31", status:"Active", name:"Babs McBadbeans", givenName:"Babs", familyName:"McBadbeans", email:"Badbeans@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"32", status:"Active", name:"Carl McCrispy", givenName:"Carl", familyName:"McCrispy", email:"Carl@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"33", status:"Active", name:"DeeDee McDope", givenName:"DeeDee", familyName:"McDope", email:"McDope@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"34", status:"Active", name:"Eric McErmine", givenName:"Eric", familyName:"McErmine", email:"Eric@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"35", status:"Active", name:"Frank McFrank", givenName:"Frank", familyName:"McFrank", email:"Frank@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
		{ id:"36", status:"Active", name:"Gomer McGomps", givenName:"Gomer", familyName:"McGomps", email:"Gomer@fake.com", roles: ["Learner"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png" },
	]
}


// TODO: Make this id NOT studentId
const mockScoresFromLms = [
  { studentId:"10", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.fullyGraded, comment:'' },
  { studentId:"11", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.fullyGraded, comment:'' },
  { studentId:"12", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"13", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"14", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"20", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"21", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"22", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"23", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"24", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"25", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"30", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"31", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"32", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"33", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"34", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"35", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' },
  { studentId:"36", instructorScore:0, gradingProgress:HOMEWORK_PROGRESS.notBegun, comment:'' }
]


export const emptyAssignment = {
	id: '',
	ownerId: '',
	title: '',
	summary: '',
	image: '',
	isLockedOnSubmission: true,
	lockOnDate: 0,
	quizQuestions: [{
		questionText: 'Question #1',
		answerOptions: ['Answer A'],
		correctAnswerIndex: 0,
		progressPointsForCompleting: 1,
		gradePointsForCorrectAnswer: 10
	}]
};



export const mockHomeworks = [
	{
		id: 'hmwk-001',
		assignmentId: 'asgnmnt001',
		studentId: '10',
		quizAnswers: [3, 2],
		submittedOnDate: moment().valueOf(),
		isLocked: false,
	}, {
		id: 'hmwk-002',
		assignmentId: 'asgnmnt001',
		studentId: '11',
		quizAnswers: [3,3],
		submittedOnDate: moment().valueOf(),
		isLocked: false,
	}, {
		id: 'hmwk-003',
		assignmentId: 'asgnmnt002',
		studentId: '11',
		quizAnswers: [-1,-1],
		submittedOnDate: 0,
		isLocked: false,
	}, {
		id: 'hmwk-004',
		assignmentId: 'asgnmnt002',
		studentId: '12',
		quizAnswers: [0, 2],
		submittedOnDate: moment().valueOf(),
		isLocked: false,
	},
];

export const mockAssignments = [
	{
		id: 'asgnmnt001',
		ownerId: 'user-id-nobody',
		title: 'Plague Quiz #1',
		summary: 'Kiddie questions about the plague',
		image: '',
		isLockedOnSubmission: true,
		quizQuestions: [{
			questionText: 'Q1 - What is the Bubonic Plague?',
			answerOptions: ["A theme park ride", "A flavor of Baskin Robbins ice cream", "A potluck favorite", "God's punishment for bad behavior", "All of the above"],
			correctAnswerIndex: 3,
			progressPointsForCompleting: 1,
			gradePointsForCorrectAnswer: 50
		}, {
			questionText: 'Q2 - What should you do if you catch the Bubonic Plague?',
			answerOptions: ["Throw it back to the third baseman to prevent a home run", "Give it a name and keep it as a pet", "Share it with your friends", "Repent for your miserable sins", "All of the above"],
			correctAnswerIndex: 2,
			progressPointsForCompleting: 1,
			gradePointsForCorrectAnswer: 50
		}]
	}, {
		id: 'asgnmnt002',
		title: 'Insect Mania Quiz #2',
		summary: 'Cockroach exam for 1st graders',
		image: '',
		isLockedOnSubmission: true,
		lockOnDate: moment().add(2, 'days').valueOf(),
		quizQuestions: [{
			questionText: 'What is the correct way to eat a cockroach?',
			answerOptions: ["Slowly, between 2 marshmallows", "In fondue", "Toss and catch in your mouth, like a cheezit", "Dipped in ketchup"],
			correctAnswerIndex: 2,
			progressPointsForCompleting: 1,
			gradePointsForCorrectAnswer: 20
		}, {
			questionText: 'Will you get an A if you eat a live cockroach in front of the class?',
			answerOptions: ["true", "false", "true, but only if it's larger than 3 inches long", "false, but don't tell Timmy cuz he'll probably actually DO it!"],
			correctAnswerIndex: 2,
			progressPointsForCompleting: 2,
			gradePointsForCorrectAnswer: 80
		}]
	}
]


const getAsyncSpecs = () => {
	return ({isMockFailureResult: Boolean((Math.random() * 20) < 1), mockDuration: (Math.random() * 3000) + 250})
}


export const createMockLmsData = () => {
  localStorage.setItem('mockScoresFromLms', JSON.stringify(mockScoresFromLms));
}


// ===============================================================


// fetchAllMembersFromLms(assignmentId)
export const fetchMembersAndContextFromLms = (assignmentId, isMockFailurePossible = false) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailurePossible && isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by MOCKED fetchAllMembersFromLms()")), mockDuration);
  } else {
    // We now take the results we expect from LMS and further message the data to fit our data model format
    setTimeout(() => resolve(mockMembersAndContextFromLms, mockDuration));
  }
});


export const fetchAllGradesFromLMS = (assignmentId, isMockFailurePossible = false) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailurePossible && isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockSendGradeToLMS()")), mockDuration);
  } else {
    let userGrades = JSON.parse(localStorage.getItem('mockScoresFromLms'));
    // userGrades = (!userGrades) ? mockScoresFromLms : userGrades;
    console.log(">>> GET userGrades from LMS: ", userGrades)
    setTimeout(() => resolve(userGrades, mockDuration));
  }
});



export const fetchStudentGradeFromLMS = (assignmentId, studentId, isMockFailurePossible = false) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();
  let userGrades = JSON.parse(localStorage.getItem('mockScoresFromLms'));
  const theGrade = userGrades.find(g => g.studentId === studentId);

  if (isMockFailurePossible && isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by fetchStudentGradeFromLMS()")), mockDuration);
  } else if (!theGrade) {
    setTimeout(() => resolve(null, mockDuration));
  } else {
    setTimeout(() => resolve(theGrade, mockDuration));
  }
});


export const mockSendGradeToLMS = (studentId, instructorScore, comment, isMockFailurePossible = false) => new Promise(function (resolve, reject) {
  const {isMockFailureResult, mockDuration} = getAsyncSpecs();

  if (isMockFailurePossible && isMockFailureResult) {
    setTimeout(() => reject(new Error("====> MOCK ERROR triggered by mockSendGradeToLMS()")), mockDuration);
  } else {
    setTimeout(() => {
      let userGrades = JSON.parse(localStorage.getItem('mockScoresFromLms'));
      let gradeIndex = userGrades.findIndex(g => g.studentId === studentId);
      if (gradeIndex > -1) {
        userGrades[gradeIndex].instructorScore = instructorScore;
        userGrades[gradeIndex].comment = comment;
        userGrades[gradeIndex].gradingProgress = HOMEWORK_PROGRESS.fullyGraded;
      } else {
        userGrades.push({studentId, instructorScore, comment, gradingProgress:HOMEWORK_PROGRESS.fullyGraded});
      }
      console.log(">>> SET userGrades from LMS: ", userGrades)
      localStorage.setItem('mockScoresFromLms', JSON.stringify(userGrades));

      resolve(true, mockDuration)
    });
  }
});
