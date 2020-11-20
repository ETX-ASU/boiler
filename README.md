
# Creating a new application:
Before starting you will need access to aws-etx repository and the aws-asu account.
## 1. Create new repository in EXT-ASU for your application
     location here: https://github.com/ETX-ASU (or repository of your choice)
## 2. Clone repository into your local environment
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