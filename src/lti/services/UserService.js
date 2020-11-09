"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssignedStudents = exports.getUnassignedStudents = exports.getUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const getUsers = async (role) => {
    rl_shared_1.logger.debug(`hitting endpoint GET:${rl_shared_1.ROSTER_ENDPOINT}`);
    const results = await axios_1.default
        .get(rl_shared_1.ROSTER_ENDPOINT, { params: { role: role } })
        .then((results) => {
        rl_shared_1.logger.debug(JSON.stringify(results));
        return results.data;
    });
    return results;
};
exports.getUsers = getUsers;
const getUnassignedStudents = async (assignmentId, resourceLinkId) => {
    const results = await axios_1.default
        .get(rl_shared_1.GET_UNASSIGNED_STUDENTS_ENDPOINT, {
        params: {
            lineItemId: assignmentId,
            resourceLinkId: resourceLinkId
        }
    })
        .then((results) => {
        rl_shared_1.logger.debug("getUnAssignedStudets-" + JSON.stringify(results.data));
        return results.data;
    });
    return results;
};
exports.getUnassignedStudents = getUnassignedStudents;
const getAssignedStudents = async (assignmentId, resourceLinkId) => {
    const results = await axios_1.default
        .get(rl_shared_1.GET_ASSIGNED_STUDENTS_ENDPOINT, {
        params: {
            lineItemId: assignmentId,
            resourceLinkId: resourceLinkId
        }
    })
        .then((results) => {
        rl_shared_1.logger.debug("getAssignedStudets-" + JSON.stringify(results.data));
        return results.data;
    });
    return results;
};
exports.getAssignedStudents = getAssignedStudents;
