const dotenv = require('dotenv').config();
const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app-instance');

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
