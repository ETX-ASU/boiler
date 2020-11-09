"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitResourceSelection = exports.getDeepLinkResourceLinks = void 0;
const axios_1 = __importDefault(require("axios"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const rl_shared_2 = require("@asu-etx/rl-shared");
const getDeepLinkResourceLinks = async () => {
    rl_shared_2.logger.debug(`hitting endpoint GET:${rl_shared_1.DEEP_LINK_RESOURCELINKS_ENDPOINT}`);
    const links = await axios_1.default.get(rl_shared_1.API_URL + rl_shared_1.DEEP_LINK_RESOURCELINKS_ENDPOINT).then((results) => {
        rl_shared_2.logger.debug(JSON.stringify(results.data));
        return results.data;
    });
    return links;
};
exports.getDeepLinkResourceLinks = getDeepLinkResourceLinks;
const submitResourceSelection = async (resourceLink) => {
    rl_shared_2.logger.debug(`hitting endpoint POST:${rl_shared_1.DEEP_LINK_ASSIGNMENT_ENDPOINT}`);
    const assignment = await axios_1.default
        .post(rl_shared_1.API_URL + rl_shared_1.DEEP_LINK_ASSIGNMENT_ENDPOINT, {
        contentItems: [resourceLink]
    })
        .then((result) => {
        rl_shared_2.logger.debug(result);
        return result.data;
    });
    return assignment;
};
exports.submitResourceSelection = submitResourceSelection;
