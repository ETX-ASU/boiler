"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rl_server_lib_1 = require("@asu-etx/rl-server-lib");
const ltiServiceEndpoints = (app) => {
    //rl_server_lib_1.rlLtiServiceExpressEndpoints(app);
    "use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ToolConsumerService_1 = require("../services/ToolConsumerService");
const requestLogger_1 = __importDefault(require("../middleware/requestLogger"));
const ltiAppService_1 = require("../services/ltiAppService");
const validationService_1 = __importDefault(require("../services/validationService"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const aws_cache = __importDefault(require("aws-amplify"));
// NOTE: If we make calls from the client directly to Canvas with the token
// then this service may not be needed. It could be used to show how the calls
// can be made server side if they don't want put the Canvas idToken into a
// cookie and send it to the client

function getPlatform(req) {
    let session = req.session;
    if (!req.session) {
        session = aws_cache.Cache.getItem(req.query.userId+req.query.courseId);
    }
    return session.platform;
}

const rlLtiServiceExpressEndpoints = (app) => {

    app.get(rl_shared_1.ROSTER_ENDPOINT, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        res.send(ltiAppService_1.getRoster(platform, req.query.role));
    });
    app.get(rl_shared_1.GET_UNASSIGNED_STUDENTS_ENDPOINT, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const reqQueryString = req.query;
        if (reqQueryString && reqQueryString.lineItemId) {
            res.send(ltiAppService_1.getUnassignedStudents(platform, req.query.resourceLinkId));
        }
    });
    app.get(rl_shared_1.GET_ASSIGNED_STUDENTS_ENDPOINT, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const lineItemId = req.query.lineItemId;
        const resourceLinkId = req.query.resourceLinkId;
        res.send(ltiAppService_1.getAssignedStudents(platform, lineItemId, resourceLinkId));
    });
    app.post(rl_shared_1.PUT_STUDENT_GRADE_VIEW, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const title = req.session.title;
        const score = req.body.params;
        res.send(ltiAppService_1.putStudentGradeView(platform, score, title));
    });
    app.post(rl_shared_1.DEEP_LINK_ASSIGNMENT_ENDPOINT, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const contentItems = req.body.contentItems;
        return res.send(ltiAppService_1.postDeepLinkAssignment(platform, contentItems));
    });
    app.post(rl_shared_1.PUT_STUDENT_GRADE, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const title = req.session.title;
        const score = req.body.params;
        res.send(ltiAppService_1.putStudentGrade(platform, score, title));
    });
    app.delete(rl_shared_1.DELETE_LINE_ITEM, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        const lineItemId = req.query.lineItemId;
        res.send(ltiAppService_1.deleteLineItem(platform, lineItemId));
    });
    app.get(rl_shared_1.GET_GRADES, requestLogger_1.default, async (req, res) => {
        const platform = getPlatform(req);
        res.send(ltiAppService_1.getGrades(platform, req.query.lineItemId));
    });
    app.get(rl_shared_1.GET_JWKS_ENDPOINT, requestLogger_1.default, async (req, res) => {
        const query = req.query;
        const consumerTool = ToolConsumerService_1.getToolConsumerByName(query.name);
        res.send(consumerTool);
    });
    app.get(rl_shared_1.LTI_SESSION_VALIDATION_ENDPOINT, requestLogger_1.default, async (req, res) => {
        rl_shared_1.logger.debug(`sessionquery: ${JSON.stringify(req.query["platform"])}`);
        const platform = getPlatform(req);
        res.send({ isValid: validationService_1.default(platform) });
    });
};
exports.default = rlLtiServiceExpressEndpoints;
};
exports.default = ltiServiceEndpoints;
