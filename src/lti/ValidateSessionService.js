import API from "@aws-amplify/api";
import { LTI_SESSION_VALIDATION_ENDPOINT, logger } from "@asu-etx/rl-shared";
import aws_exports from '../aws-exports';

API.configure(aws_exports);
console.log(`api configuration: ${JSON.stringify(API.configure())}`);

const LTI_API_NAME = "ringleaderapi";
const hasValidSession = async () => {
  const hasValidSession = await API.get(
    LTI_API_NAME,
    LTI_SESSION_VALIDATION_ENDPOINT
  );
  console.log(`hasValidSession: ${hasValidSession}`);
  return hasValidSession.isValid;
};

export { hasValidSession };
