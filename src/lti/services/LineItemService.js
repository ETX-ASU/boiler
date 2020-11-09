"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLineItem = exports.getLineItems = void 0;
const axios_1 = __importDefault(require("axios"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const getLineItems = () => {
    rl_shared_1.logger.debug(`hitting endpoint GET:${rl_shared_1.GET_ASSIGNMENT_ENDPOINT}`);
    const results = axios_1.default.get(rl_shared_1.GET_ASSIGNMENT_ENDPOINT).then((results) => {
        rl_shared_1.logger.debug(JSON.stringify(results.data));
        if (results.data.length <= 0) {
            return [];
        }
        return results.data;
    });
    return results;
};
exports.getLineItems = getLineItems;
const deleteLineItem = (assignmentId) => {
    rl_shared_1.logger.debug(`hitting DELETE_LINE_ITEM: ${rl_shared_1.DELETE_LINE_ITEM}`);
    const results = axios_1.default
        .delete(rl_shared_1.DELETE_LINE_ITEM, {
        params: {
            lineItemId: assignmentId
        }
    })
        .then((results) => {
        rl_shared_1.logger.debug(`deleteLineItem: ${JSON.stringify(results.data)}`);
        return results.data;
    });
    return results;
};
exports.deleteLineItem = deleteLineItem;
