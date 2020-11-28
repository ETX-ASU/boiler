require('dotenv').config();
const { logger } = require('@asu-etx/rl-shared');
const awsServerlessExpress = require('aws-serverless-express');

//TOOL_CONSUMERS should be set up through the amplify console ui, environment variables.
// local is left as an example of what you should be setting.
const environment = process.env.environment ? process.env.environment : "local";
process.env.TOOL_CONSUMERS = process.env.TOOL_CONSUMERS ? process.env.TOOL_CONSUMERS : JSON.stringify(require(`./environments/${environment}/.tool_consumers.${environment}.json`));


const app = require('./app-cached');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  logger.debug("process.env:" + JSON.stringify(process.env));
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
