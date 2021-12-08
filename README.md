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

## 4. Additional backend requirements for LTI Lambda:

      a. LIT requires a Session dynamodb table. Specifically because the ltilambda requires access to Dynamodb and currently there is no support for adding a dynamodb resource to the REST API backend, you will need to create a new dynamodb table in your region, called YOUR_APPLICATION_SESSION. This will need to be added to the .env file (see below). Then add permissions through the AWS console to the specific lambda generated as part of the amplify build process to give the lambda access to create, populate and access the table.

      b. LTI requires that the API Gateway has enabled CORS for the backend APIs. The backend and the frontend applications will exist in different domains, at least during development.

      c. env values which will need to be updated, found at amplify/backend/function/ltilambda/src/.env:
         i. environment=local (name of folder inside environments that contains tool consumers for this tool, typically set to your working amplify env)
         ii. URL_ROOT=/stage #(suffix of the amplify env that is being pushed)
         iii. API_URL=https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com #(base url for ltilambda API)
         iv. APPLICATION_URL=https://stage.dyl4ur5zvn9kt.amplifyapp.com #(url of the react application)
         v. DYNAMO_TYPES_ENDPOINT=https://dynamodb.us-west-2.amazonaws.com #(endpoint for dynamodb endpoint)
         vi. DEEP_LINK_DISPLAY_BASE_URL=https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com #(typically same as API_URL but can be different)
         vii. SESSION_TABLE_NAME=YOUR_APPLICATION_SESSION #whatever you end up calling your session table.

## 5. How to add a new Consumer:

* Make sure that the .env file has been created and is accurate
* When a new consumer (Canvas, Moodle etc) is to be added to the tool,  a new tool configuration will need to be created in the tool_consumer.json for that environment and data will need to be inserted from the Consumer and added to the configuration.
* Starting at the project root do the following:

```
   cd ./amplify/backend/function/ltilambda/src in a terminal
   yarn run setup-tool-keys --name=my-new-consumer
```

Note: you may need to adjust the script to properly find your tool_consumers.${environment}.json, (make sure you have updated env with the name of you environment)

* Find the tool_consumers.${environment}.json file open it you should see an object with the name (my-new-consumer):

  ```

        {
    "name": "my-new-consumer",
    "uuid": "44D20B6A3D8F417C99BAE8F53864DF58",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDkVZaSELGXHOnd\nqpL/087VT3qkO0x4DpngwVB3l0UW/vhoIRGsnobJ3d1nTGbHuxNiv1IQtLsbg7FI\npNaUkuDZJdCY4IBUcT52pi2VEv9TbNKoD2tz9EA1VkC8aEWvCYNwktB6F/OXL4T4\noM1RUabD44UK9SF4lsP6FIRYj/OfqobPYrG05F97ojl9Z3rjcCOeKCSaRzdR9UYh\nxtnnJBHUeTcBt8m1uREgtxs0ncThWdKJtvJEA8jjGe2AtBrwDJ9BFarQl3Nqtf7x\nk8H0Z0+uYwZ8yMhhHHPGNt+759yYevogRndqTSZXWqs4EXW7Lskx50TDn44MnqX7\n6NNyCg6fAgMBAAECggEBAN+9Ji+2f+5M/LSioixghfnrSYeIO6Qg2pOrmYe2CJNC\nAHM4hDMbm4RPDNZdvRDVtWc7hdSs4/NQFfXS4Bjx27WsIjzLL7SOyuBEccHzvZEn\nvzvC8E3M9uXMwN5dZnrf3ZX/pp0cvypT+/4Mw2N9mOW2GfXkwYmCYkK4u/50AAtg\nmY8qk63lYywFzP76G4p/8d1EkV13SQiPF9m1dQGQ0eQI7+kUbises19qILw7IQuj\n9kYVBLSjgtrhRBar7DPABJ60sZxm3ZrdEz70d6IZIDTZA0RfAR9no4W8ihJwUvKA\nxhcGDljlh0+0ZpJ8VPySAHa+QCAf9nIr8VUWFKueyLECgYEA9wOJ+NNXmvqAwYJX\nokebS3oTS0YDlmSgZjs51+j1Gv9w3sJ67E5GfnEkBHcXq+0QKkDcVvDWMtidDIdk\nO9xaKHQs1wThNoeVLNmdHZn6ln2bIy7JLKzpx+qqzo9R4ZaGuEWgO1rzUaKXCgX/\ncS38V5bf0lLJraXERQWIPEFtNhsCgYEA7KQV4OUV53nElsbV24pRL/Lxbllzr9pU\n7cUnxAozACgvoItw2c1aW4Vys9oLED6tpSatW5NPjWu3VPJ0jxYzINmtPrkgEb9L\nqIfzfYoHC2YM7J6SKLfKaCF8Ewcm24L4xoXjtS35nyvpVxGLqVrF2XsUPW+RQpAY\nUl41wOOY4c0CgYEAz0D85vYMr1A38CU4+kQynKWUwrfAEtPjcWOIKQyhe0GQppdv\nJA6ZP0YW/lgeWHbT9V/ugFQapRbyzqxbAY7lZsPzS4YgoOwp0jPUjB3CD7rcDC0Z\nRo7eqIrRPfcqsKjn6H0i8Cpjtb9CE3rs1T3MWIGS0pn79eL8Rx1ZLZWH2LkCgYA3\nS7hZDu7pYgjP+rJqVI3YGHrWAE0KIIiL7u/13TRBqyJF7491NYkRrcM5x4+iQiMt\nXjZQGcITF8KFNQqLjPJxkKvs5jFaNEsnnG0HPsOapEQM3pjkrt27K2fkwl0QGjCr\nowmsgou75/TkhZMPBckJorr+CB33YdhtFtqUsho9WQKBgQCm3gudrfSi6MFuAyHQ\nyFoNINo4Zn/7j/Cf90DjJjswB/D1nFZFaXGZSMDsnJge4MYfqvqjvZeFFOTx4M7Z\nLQCOZCSylOGSj5x65v5qU7YawrFZtX9fnnb0d2DDioYwxCVEKcBDJDKPKkPaYW9H\nhkbr1aZ3BxDEV4BDHQfQC8AvHw==\n-----END PRIVATE KEY-----\n",
    "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5FWWkhCxlxzp3aqS/9PO\n1U96pDtMeA6Z4MFQd5dFFv74aCERrJ6Gyd3dZ0xmx7sTYr9SELS7G4OxSKTWlJLg\n2SXQmOCAVHE+dqYtlRL/U2zSqA9rc/RANVZAvGhFrwmDcJLQehfzly+E+KDNUVGm\nw+OFCvUheJbD+hSEWI/zn6qGz2KxtORfe6I5fWd643Ajnigkmkc3UfVGIcbZ5yQR\n1Hk3AbfJtbkRILcbNJ3E4VnSibbyRAPI4xntgLQa8AyfQRWq0JdzarX+8ZPB9GdP\nrmMGfMjIYRxzxjbfu+fcmHr6IEZ3ak0mV1qrOBF1uy7JMedEw5+ODJ6l++jTcgoO\nnwIDAQAB\n-----END PUBLIC KEY-----\n",
    "public_key_jwk": {
         "kty": "RSA",
         "n": "5FWWkhCxlxzp3aqS_9PO1U96pDtMeA6Z4MFQd5dFFv74aCERrJ6Gyd3dZ0xmx7sTYr9SELS7G4OxSKTWlJLg2SXQmOCAVHE-dqYtlRL_U2zSqA9rc_RANVZAvGhFrwmDcJLQehfzly-E-KDNUVGmw-OFCvUheJbD-hSEWI_zn6qGz2KxtORfe6I5fWd643Ajnigkmkc3UfVGIcbZ5yQR1Hk3AbfJtbkRILcbNJ3E4VnSibbyRAPI4xntgLQa8AyfQRWq0JdzarX-8ZPB9GdPrmMGfMjIYRxzxjbfu-fcmHr6IEZ3ak0mV1qrOBF1uy7JMedEw5-ODJ6l--jTcgoOnw",
         "e": "AQAB",
         "alg": "RS256",
         "use": "sig",
         "kid": "my-new-consumer:44D20B6A3D8F417C99BAE8F53864DF58"
    },
    "alg": "RS256",
    "keyid": "my-new-consumer:44D20B6A3D8F417C99BAE8F53864DF58",
    "client_id": "client_id supplied by consumer/platform",
    "iss": "iss supplied by consumer/platform",
    "deployment_id": "deployment_id supplied by consumer/platform"
    "platformOIDCAuthEndPoint": "client_id supplied by consumer/platform",
    "platformAccessTokenEndpoint": "platformAccessTokenEndpoint supplied by consumer/platform",
    "platformAccessTokenAud": "platformAccessTokenEndpoint supplied by consumer/platform can be null", 
    "platformPublicJWKEndpoint": "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint",
    "platformPublicKey": "not required: one or the other of platformPublicKey/platformPublicJWKEndpoint"
    }

  ```

You will need to fill in all the values where it says "supplied by consumer/platform" from documentation supplied by the consumer and or generated as part of the installation process. And add platformPublicJWKEndpoint or platformPublicKey (platformPublicJWKEndpoint is preferred. Set the one not filled to an empty string)

## Example Information You Will need for the Consumer/Platform

REPLACE: https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage with the actual root/base url of the Tool instance.

1. Tool End-Point to Receive Launches
   (Note: this is the target_link_url that the cert suite will send in OIDC initiation.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/lti-advantage-launch
2. OIDC Login Initiation URL
   (Note: this is your tool's OIDC initiation URI.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/init-oidc
3. Tool OIDC Launch Redirect URL
   (Note: this should be the REGISTERED URL for your Tool. The cert suite POSTs launches here!)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/lti-advantage-launch
4. Tool End-Point to Receive Deep Link Launches
   (Note: this is the target_link_url that the cert suite will send in OIDC initiation for Deep Linking.)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/deeplink
5. Tool OIDC Redirect Deep Linking URL
   (Note: this is the REGISTERED URL in OIDC for your Tool's Deep Linking. The cert suite POSTs launches here!)
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/deeplink
6. Tool PUBLIC JWKS
   You can either either supply IMS with a public key in PEM format or JWT OR you can give them the url that will send a list of public jwk keys:
   https://1cxw5vr28f.execute-api.us-west-2.amazonaws.com/stage/jwks

## List of toolApplicationUrls that you will need to supply if not canvas json install, or Blackboard:

1. Process Planner: https://main.d2cx84babvjpbq.amplifyapp.com
2. Peer Review Tool: https://main.d1nwigklju3y36.amplifyapp.com
3. Charting Data Tool: https://main.d8y8in5fp9djc.amplifyapp.com

Further explanation for what will need to be added between tool and consumer can be found in the ringleader project documentation.
In addition you will find some notes on the IMS certification process when using the ring leader libraries.
