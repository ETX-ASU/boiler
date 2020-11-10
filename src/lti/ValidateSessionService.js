import API from "@aws-amplify/api";
import { LTI_SESSION_VALIDATION_ENDPOINT } from "@asu-etx/rl-shared";
import aws_exports from '../aws-exports';

API.configure(aws_exports);

const LTI_API_NAME = "ringleaderapi";
const hasValidSession = async () => {
  const hasValidSession = await API.get(
    LTI_API_NAME,
    LTI_SESSION_VALIDATION_ENDPOINT+window.location.search
  );
  console.log(`hasValidSession: ${JSON.stringify(hasValidSession)}`);
  return hasValidSession.isValid;
};

export { hasValidSession };
