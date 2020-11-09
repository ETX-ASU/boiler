"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValidSession = void 0;
const axios_1 = __importDefault(require("axios"));
const rl_shared_1 = require("@asu-etx/rl-shared");
const queryString = require("query-string");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const hasValidSession = async () => {
    rl_shared_1.logger.debug(`hitting endpoint GET:${rl_shared_1.LTI_SESSION_VALIDATION_ENDPOINT}`);
    const search = window.location.search;
    console.log(search);
    const parsed = queryString.parse(search);
    const platform = parsed.platform;
    if (platform) {
        const hasValidSession = await axios_1.default
            .get(rl_shared_1.API_URL + rl_shared_1.LTI_SESSION_VALIDATION_ENDPOINT + `?platform=${platform}`)
            .then((results) => {
            rl_shared_1.logger.debug(JSON.stringify(results));
            return results.data;
        });
        return hasValidSession.isValid;
    }
    return false;
};
exports.hasValidSession = hasValidSession;
