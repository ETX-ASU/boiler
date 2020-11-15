"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const global_request_logger_1 = __importDefault(require("global-request-logger"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const ltiLaunchEndpoints_1 = __importDefault(require("./endpoints/ltiLaunchEndpoints"));
const ltiServiceEndpoints_1 = __importDefault(require("./endpoints/ltiServiceEndpoints"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const rl_server_lib_1 = require("@asu-etx/rl-server-lib");
const { getToolConsumer } = require("@asu-etx/rl-server-lib/build/services/ToolConsumerService");
__importDefault(require("./environment"));

/*========================== LOG ALL REQUESTS =========================*/
global_request_logger_1.default.initialize();
global_request_logger_1.default.on("success", (request, response) => {
    rl_shared_1.logger.info({ request: request });
    rl_shared_1.logger.info({ response: response });
});
global_request_logger_1.default.on("error", (request, response) => {
    rl_shared_1.logger.info({ request: request });
    rl_shared_1.logger.info({ response: response });
});
/*========================== INITIAL SERVER CONFIG ==========================*/
// generate an express instance, the start of our http(s) request handler
const app = express_1.default();
// avoid signature failure for LTI https://github.com/omsmith/ims-lti/issues/4
app.enable("trust proxy");
/*========================== GLOBAL MIDDLEWARE ==========================*/
// make req.body access easier for all request handlers
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
// In Memory Sessions ( not recommended for production servers )
//rl_server_lib_1.initDBTables();

// Enable CORS for all methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
  });

app.use(express_session_1.default({
    secret: "demo-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: "none",
        secure: true,
        httpOnly: false // ideally set this to true so the client window can't access the cookie
    }
}));
// UI static asset server ( CSS, JS, etc...)
// This points the root to the built create react app in rl-tool-example-client
//app.use("/", express_1.default.static(environment_1.USER_INTERFACE_ROOT));
/*========================== REGISTER REST ENDPOINTS ==========================*/
// lti 1.3 launch with context and establish session
ltiLaunchEndpoints_1.default(app);
// lti 1.3 advantage service endpoints. NOTE: If we decide to only make calls client side with the idToken
// then these endpoints will not be needed. They could be completed to show what a server side flow might look like
ltiServiceEndpoints_1.default(app);
/*
app.use(rl_shared_1.LTI_INSTRUCTOR_REDIRECT, express_1.default.static(environment_1.USER_INTERFACE_ROOT));

app.use(rl_shared_1.LTI_STUDENT_REDIRECT, express_1.default.static(environment_1.USER_INTERFACE_ROOT));

app.use(rl_shared_1.LTI_ASSIGNMENT_REDIRECT, express_1.default.static(environment_1.USER_INTERFACE_ROOT));

app.use(rl_shared_1.LTI_DEEPLINK_REDIRECT, express_1.default.static(environment_1.USER_INTERFACE_ROOT));
*/
/*========================== UI ENDPOINTS ==========================*/
// Instructor
const APPLICATION_URL = process.env.APPLICATION_URL;
const getParameters = async (req, role) => {
    const platform = req.session.platform;
    const userId = platform.userId;
    const courseId = platform.context_id;
    const resourceLinkId = platform.resourceLinkId;
    const findConsumer =  {iss:platform.iss,
    client_id:platform.clientId,
    deployment_id : platform.deploymentId}
    console.log(`attempting to find consumerTool with following values: ${findConsumer}`);
    const toolConsumer = getToolConsumer(findConsumer);
    const hash = rl_server_lib_1.getRedirectToken(toolConsumer, userId+courseId);
    let session = {};
    try {
        session = new rl_server_lib_1.Session();
        session.sessionId =  platform.userId +  platform.context_id;
        session.session = JSON.stringify(req.session);
        await rl_server_lib_1.Session.writer.put(session); 
        await session.save();  
        console.log(`session added : ${JSON.stringify(session)}`);
    } catch(err) {
        console.log(`session failed: ${JSON.stringify(err)}`);
        console.log(`session failed value : ${JSON.stringify(session)}`);
    }
    if(!role) {
        if(platform.isInstructor) {
            role = "instructor";
        } else {
            role = "student";
        }
    }

    //example const params = `userId=user-id-uncle-bob&courseId=the-course-id-123&resourceId=4c43a1b5-e5db-4b3e-ae32-a9405927e472`
    if(resourceLinkId !== courseId)
        return `/assignment?role=${role}&userId=${userId}&courseId=${courseId}&resourceId=${resourceLinkId}&hash=${hash}`
    return `?role=${role}&userId=${userId}&courseId=${courseId}&hash=${hash}`
};

app.route(rl_shared_1.LTI_INSTRUCTOR_REDIRECT).get(async (req, res) => {
    rl_shared_1.logger.debug(`hitting instructor request ${APPLICATION_URL}:${JSON.stringify(req.session)}`);
    const params = await getParameters(req, "instructor");
    res.status(301).redirect( APPLICATION_URL + params);
});
// Student
app.route(rl_shared_1.LTI_STUDENT_REDIRECT).get(async (req, res) => {
    const params = await getParameters(req, res, "learner");
    res.status(301).redirect( APPLICATION_URL + params);
});
// Student Assignment
app.route(rl_shared_1.LTI_ASSIGNMENT_REDIRECT).get(async (req, res) => {
    const params = await getParameters(req, null);
    res.status(301).redirect( APPLICATION_URL + params);
});
// Deep Link
app.route(rl_shared_1.LTI_DEEPLINK_REDIRECT).get(async (req, res) => {
    const params = await getParameters(req, null);
    res.status(301).redirect(APPLICATION_URL + params+ "&mode=selectAssignment" );
});


app.listen(3000, function() {
    console.log("App started")
});

module.exports = app;