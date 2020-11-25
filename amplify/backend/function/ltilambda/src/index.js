require('dotenv').config();
const awsServerlessExpress = require('aws-serverless-express');

//TOOL_CONSUMERS should be set up through the amplify console ui, environment variables.
//const environment = process.env.environment ? process.env.environment : "local";
//process.env.TOOL_CONSUMERS = process.env.TOOL_CONSUMERS ? process.env.TOOL_CONSUMERS : JSON.stringify(require(`./environments/${environment}/.tool_consumers.${environment}.json`));
const app = require('./app-cached');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
