"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitInstructorGrade = exports.getGrades = exports.submitGrade = void 0;
const axios_1 = __importDefault(require("axios"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const submitGrade = async (params) => {
    const results = await axios_1.default
        .post(rl_shared_1.PUT_STUDENT_GRADE, {
        params: params
    })
        .then((results) => {
        rl_shared_1.logger.debug(`PUT_STUDENT_GRADE: ${rl_shared_1.PUT_STUDENT_GRADE}, results: ${JSON.stringify(results.data)}`);
        return results.data;
    });
    return results;
};
exports.submitGrade = submitGrade;
const submitInstructorGrade = async (params) => {
    const results = await axios_1.default
        .post(rl_shared_1.PUT_STUDENT_GRADE, {
        params: params
    })
        .then((results) => {
        rl_shared_1.logger.debug(`PUT_STUDENT_GRADE: ${rl_shared_1.PUT_STUDENT_GRADE}, results: ${JSON.stringify(results.data)}`);
        return results.data;
    });
    return results;
};
exports.submitInstructorGrade = submitInstructorGrade;
const getGrades = (assignmentId) => {
    const grades = axios_1.default
        .get(rl_shared_1.GET_GRADES, {
        params: {
            lineItemId: assignmentId
        }
    })
        .then((results) => {
        rl_shared_1.logger.debug(JSON.stringify(results.data));
        return results.data;
    });
    return grades;
};
exports.getGrades = getGrades;
