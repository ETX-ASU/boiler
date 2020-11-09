import API from "@aws-amplify/api";
import { LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";

API.configure();

const LTI_API_NAME = "https://3m04i9b475.execute-api.us-west-2.amazonaws.com/jimd";
const hasValidSession = async () => {
  const hasValidSession = await API.get(
    LTI_API_NAME,
    LTI_SESSION_VALIDATION_ENDPOINT
  );
  console.log(`hasValidSession: ${hasValidSession}`);
  return hasValidSession.isValid;
};

export { hasValidSession };
