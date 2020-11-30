
# Creating a new application:
Before starting you will need access to aws-etx repository and the aws-asu account.
## 1. Create new repository in EXT-ASU for your application
     location here: https://github.com/ETX-ASU (or repository of your choice)
## 2. Fork repository into your local environment
      https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo
## 3. Install amplify cli:
     instructions are here https://docs.amplify.aws/cli/start/install

```
amplify configure
Specify the AWS Region
? region:  us-west-2
Specify the username of the new IAM user:
? user name:  ring-leader-amplify-YOUR_APP_NAME
Complete the user creation using the AWS console
Enter the access key of the newly created user:
? accessKeyId:  # YOUR_ACCESS_KEY_ID
? secretAccessKey:  # YOUR_SECRET_ACCESS_KEY
This would update/create the AWS Profile in your local machine
? Profile Name:  # (default)

Successfully set up the new user.

```
## 4. Additional backend requirements for LTI backend:
  1. LIT requires a Session dynamodb table. Specifically because the ltilambda requires access to Dynamodb and currently there is no support for adding a dynamodb resource to the REST API backend, you will need to create a new dynamodb table in your region, called Session. Then add permissions through the AWS console to the specific lambda generated as part of the amplify build process to give the lambda access to create, populate and access the table.
  
  2. LTI requires that the API Gateway has enabled CORS for the backend APIs. The backend and the frontend applications will exist in different domains, at least during development.
  
  3. .env values which will need to be updated, found at amplify/backend/function/ltilambda/src/.env:
     * environment=local (name of folder inside environments that contains tool consumers for this tool)
     * URL_ROOT=/stage (suffix of the amplify env that is being pushed)
     * API_URL=https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com (base url for ltilambda API)
     * APPLICATION_URL=https://stage.dyl4ur5zvn9kt.amplifyapp.com (url of the react application)
     * DYNAMO_TYPES_ENDPOINT=https://dynamodb.us-west-2.amazonaws.com (endpoint for dynamodb endpoint)
     * DEEP_LINK_DISPLAY_BASE_URL=https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com (typically same as API_URL but can be different)
   
