
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
   
