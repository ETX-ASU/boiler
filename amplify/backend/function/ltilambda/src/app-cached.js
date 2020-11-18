"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ltiLaunchEndpoints_1 = __importDefault(require("./endpoints/ltiLaunchEndpoints"));
const ltiServiceEndpoints_1 = __importDefault(require("./endpoints/ltiServiceEndpoints"));
const express_1 = __importDefault(require("express"));
const rl_server_lib_1 = require("@asu-etx/rl-server-lib");
//__importDefault(require("./environment-old"));
console.log("parsed.process.env:" + JSON.stringify(process.env));
const app = express_1.default();
rl_server_lib_1.cacheApp(app);

ltiLaunchEndpoints_1.default(app);
// lti 1.3 advantage service endpoints. NOTE: If we decide to only make calls client side with the idToken
// then these endpoints will not be needed. They could be completed to show what a server side flow might look like
ltiServiceEndpoints_1.default(app);

module.exports = app;