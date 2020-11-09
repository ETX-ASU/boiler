import moment from "moment";
import {
  ASSIGNMENT_STATUS_TYPES,
  HOMEWORK_PROGRESS,
  ROLE_TYPES
} from "../app/constants";


// Results from attempt to fetches all members (students & instructors) associated with this COURSE
// This probably needs to instead by changed to provide the ASSIGNMENT context
const mockMembersAndContextFromLms = {
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
	return ({isMockFailureResult: Boolean((window.isMockingFailures && Math.random() * 20) < 1), mockDuration: (Math.random() * 3000) + 250})
}


// export const createMockLmsData = () => {
//   localStorage.setItem('mockScoresFromLms', JSON.stringify(mockScoresFromLms));
// }





// ===============================================================

// run at start if window.isDevMode = true. If no user instructor 01 or 02 user exists, create them in Mock LMS local storage
export const initMockUser = (courseId) => {
  let initContext = JSON.parse(localStorage.getItem(`boiler-course-users-${courseId}`));
  let instructor1 = initContext?.members.find(m => m.id === '01');
  let instructor2 = initContext?.members.find(m => m.id === '02');
  if (instructor1 && instructor2) return;

  localStorage.setItem(`boiler-course-users-${courseId}`, JSON.stringify([
    { id:"01", status:"Active", name:"Uncle Bob McBobberton", givenName:"Bob", familyName:"McBobberton", email:"UncleBob@FakeSchool.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    { id:"02", status:"Active", name:"Freddy McFreaky", givenName:"Freddy", familyName:"McFreaky", email:"FMcFreaky@Fake.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"}
  ]));
}

// this is used via the DevUtilityDashboard to generate tons of student homework data for manual testing purposes
export const createMockLmsData = (assignmentId, courseId, students, grades) => {
  const members = [
    { id:"01", status:"Active", name:"Uncle Bob McBobberton", givenName:"Bob", familyName:"McBobberton", email:"UncleBob@FakeSchool.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    { id:"02", status:"Active", name:"Freddy McFreaky", givenName:"Freddy", familyName:"McFreaky", email:"FMcFreaky@Fake.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    ...students
  ]

  localStorage.setItem(`boiler-course-users-${courseId}`, JSON.stringify(members));
  localStorage.setItem(`boiler-scores-${assignmentId}`, JSON.stringify(grades));
}

// used via DevUtilityDashboard to erase all student and homework data associated with this assignment
export const deleteMockLmsData = (assignmentId, courseId) => {
  const members = [
    { id:"01", status:"Active", name:"Uncle Bob McBobberton", givenName:"Bob", familyName:"McBobberton", email:"UncleBob@FakeSchool.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
    { id:"02", status:"Active", name:"Freddy McFreaky", givenName:"Freddy", familyName:"McFreaky", email:"FMcFreaky@Fake.com", roles: ["instructor"], picture:"https://canvas.instructure.com/images/messages/avatar-50.png"},
  ]

  localStorage.setItem(`boiler-course-users-${courseId}`, JSON.stringify({id: 'randomUrlStrand', members}));
  localStorage.setItem(`boiler-scores-${assignmentId}`, JSON.stringify([]));
}



// ===============================================================





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







export const generateMockMembers = (total)=> {
  const prefixes = ["", " IInd", " IIIrd", " IV", " V", " VI", " VII", " VIII", " IX", " X", " 11th", " 12th", " 13th", " 14th", " 15th", " 16th", " 17th", " 18th", " 19th", " 20th"];
  let members = [];
  let prefixNum = 0;
  let studentId = 10;

  while(members.length <= total) {
    const memberSet = testNames.map((n) => {
      return {
        id: studentId++,
        status: "Active",
        name: `${n.givenName} ${n.familyName}${prefixes[prefixNum]}`,
        givenName: n.givenName,
        familyName: `${n.familyName}${prefixes[prefixNum]}`,
        email: `${n.givenName}.${n.familyName}${prefixes[prefixNum]}@FakeMail.com`,
        roles: ["Learner"],
        picture: ""
      }
    });

    members = members.concat(memberSet);
    prefixNum++;
  }

  members.splice(total);
  return members;
}

export const testNames = [
  {givenName:"Ann", familyName:"Aardvark"},
  {givenName:"Ava", familyName:"Aardwolf"},
  {givenName:"Alic", familyName:"Anthill"},
  {givenName:"Alex", familyName:"Asprin"},
  {givenName:"Aaron", familyName:"Ascott"},
  {givenName:"Betsy", familyName:"Bigbonett"},
  {givenName:"Brook", familyName:"Babbler"},
  {givenName:"Bob", familyName:"Bobberton"},
  {givenName:"Ben", familyName:"McBigsy"},
  {givenName:"Charlotte", familyName:"Chumpchange"},
  {givenName:"Chuck", familyName:"Chomp"},
  {givenName:"Carter", familyName:"Chinchilla"},
  {givenName:"Celene", familyName:"Crockpot"},
  {givenName:"Carlos", familyName:"VonCapybara"},
  {givenName:"Chelsea", familyName:"Camelton"},
  {givenName:"Dena", familyName:"Dingo"},
  {givenName:"Dan", familyName:"Dartfrog"},
  {givenName:"Derek", familyName:"Donkeyville"},
  {givenName:"Delilah", familyName:"Duckbutt"},
  {givenName:"Emma", familyName:"Ermine"},
  {givenName:"Ethan", familyName:"Elkson"},
  {givenName:"Ellen", familyName:"Eggplant"},
  {givenName:"Edgar", familyName:"VonEgret"},
  {givenName:"Fran", familyName:"McFurby"},
  {givenName:"Frank", familyName:"Feretwater"},
  {givenName:"Felix", familyName:"Fishnet"},
  {givenName:"Faith", familyName:"Friskybits"},
  {givenName:"Grace", familyName:"Geckofingers"},
  {givenName:"Gabe", familyName:"Gopherton"},
  {givenName:"Gary", familyName:"Gorillaheimer"},
  {givenName:"Gwen", familyName:"Garglespits"},
  {givenName:"Harper", familyName:"Humpback"},
  {givenName:"Henry", familyName:"Hyena"},
  {givenName:"Helen", familyName:"Howlermonkey"},
  {givenName:"Hank", familyName:"Hoseblower"},
  {givenName:"Isabel", familyName:"Inkblot"},
  {givenName:"Isaac", familyName:"Iguana"},
  {givenName:"Ivan", familyName:"Impala"},
  {givenName:"Ivanka", familyName:"Igloo"},
  {givenName:"Julia", familyName:"Jackrabbit"},
  {givenName:"Jenny", familyName:"Jellyfish"},
  {givenName:"Jack", familyName:"Jinglefingers"},
  {givenName:"Jacob", familyName:"Jamsplatt"},
  {givenName:"John", familyName:"Jumbocakes"},
  {givenName:"Jerry", familyName:"Jumpinjax"},
  {givenName:"Jackelyn", familyName:"Jigglesplits"},
  {givenName:"Kaylee", familyName:"Krawfish"},
  {givenName:"Kevin", familyName:"Kookaburra"},
  {givenName:"Kyle", familyName:"Kangarooster"},
  {givenName:"Kai", familyName:"Krumblecookie"},
  {givenName:"Karen", familyName:"Kringeworthy"},
  {givenName:"Kelly", familyName:"Komodo"},
  {givenName:"Lillian", familyName:"Limpsalot"},
  {givenName:"Liam", familyName:"McLemur"},
  {givenName:"Lester", familyName:"VonLlama"},
  {givenName:"Lisa", familyName:"Licksaspoon"},
  {givenName:"Mia", familyName:"Minimarts"},
  {givenName:"Mason", familyName:"Meerkat"},
  {givenName:"Mark", familyName:"McMarsupial"},
  {givenName:"Melissa", familyName:"Mollusk"},
  {givenName:"Mary", familyName:"Moosebait"},
  {givenName:"Natalie", familyName:"Newton"},
  {givenName:"Noah", familyName:"Nipplebinder"},
  {givenName:"Neil", familyName:"Nashtooth"},
  {givenName:"Nelly", familyName:"Notnever"},
  {givenName:"Natasha", familyName:"Narwhal"},
  {givenName:"Nicki", familyName:"Numbskull"},
  {givenName:"Olivia", familyName:"Oxbucket"},
  {givenName:"Oscar", familyName:"Orcapants"},
  {givenName:"Ollie", familyName:"Ocelot"},
  {givenName:"Olga", familyName:"Organgrinder"},
  {givenName:"Pete", familyName:"Plugpuller"},
  {givenName:"Penny", familyName:"Parkit"},
  {givenName:"Paul", familyName:"Possumbender"},
  {givenName:"Parker", familyName:"Puma"},
  {givenName:"Patricia", familyName:"Pigbits"},
  {givenName:"Quinn", familyName:"Quickerton"},
  {givenName:"Quincy", familyName:"VonQuokka"},
  {givenName:"Riley", familyName:"Rabidbat"},
  {givenName:"Rob", familyName:"Reefshark"},
  {givenName:"Ryan", familyName:"Riversquid"},
  {givenName:"Regina", familyName:"Rat"},
  {givenName:"Ron", familyName:"Rhinobinder"},
  {givenName:"Sofia", familyName:"Sheepslap"},
  {givenName:"Sam", familyName:"Sulkyshark"},
  {givenName:"Steve", familyName:"Snakefingers"},
  {givenName:"Sasha", familyName:"Skunkerton"},
  {givenName:"Svetlana", familyName:"McSamurai"},
  {givenName:"Stacy", familyName:"Sandflaps"},
  {givenName:"Stan", familyName:"Spidermonkey"},
  {givenName:"Taylor", familyName:"Topsyturvy"},
  {givenName:"Tom", familyName:"Thunderpants"},
  {givenName:"Trent", familyName:"Trickybits"},
  {givenName:"Tania", familyName:"Tigershark"},
  {givenName:"Ungar", familyName:"VonUglyshoe"},
  {givenName:"Ula", familyName:"Ulala"},
  {givenName:"Vic", familyName:"Vole"},
  {givenName:"Victoria", familyName:"Vetslap"},
  {givenName:"Vincent", familyName:"Vicarious"},
  {givenName:"Vladimir", familyName:"VonBatlegs"},
  {givenName:"Wes", familyName:"Wallaby"},
  {givenName:"Willow", familyName:"Warthog"},
  {givenName:"William", familyName:"Walrus"},
  {givenName:"Wendy", familyName:"Weasel"},
  {givenName:"Ximena", familyName:"Xylophone"},
  {givenName:"Xavier", familyName:"Xmenthal"},
  {givenName:"Yusuf", familyName:"Yakbutter"},
  {givenName:"Yaakov", familyName:"Yamsmasher"},
  {givenName:"Zoey", familyName:"Zebraparts"},
  {givenName:"Zach", familyName:"Zestwater"}
];

export const testComments = [
  "Wow.",
  "Amazing.",
  "So impressive. Really. Like, yeah.",
  "Quit school. I think you're done.",
  "Keep trying.",
  "Perhaps you should stick to gym classes.",
  "I'm not worthy.",
  "Why am I teaching? You should be teaching this.",
  "Pay me extra and I'll give you an A.",
  "I docked you points because you keep misspelling your own name.",
  "Awful.",
  "Painful to read, but brilliant when I stop.",
  "Don't take this the wrong way, but I'm giving you a passing score.",
  "Considering that you wrote this, I'm impressed.",
  "It hurts me to think you're trying your best.",
  "You are my favorite student and you can do no wrong.",
  "I feel like an idiot when I read your work. I don't know if you're so brilliant that I can't understand this, or if I'm not smart enough. Because of that, I'm going to give you a passing grade.",
  "Very average.",
  "Not the best, not the worst.",
  "Next time, try using a pen or pencil instead of crayons.",
  "Don't expect to do well in life.",
  "When you are rich and famous, please remember that I gave you straight A's.",
];