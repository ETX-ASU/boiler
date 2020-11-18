"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rl_server_lib_1 = require("@asu-etx/rl-server-lib");
//__importDefault(require("./environment-old"));

const app = express_1.default();
rl_server_lib_1.cacheApp(app);

module.exports = app;