import API from '@aws-amplify/api';
import { GET_ASSIGNMENT_ENDPOINT, DELETE_LINE_ITEM, LTI_API_NAME, logger } from "@asu-etx/rl-shared";
import aws_exports from '../aws-exports';
import {getHash, startParamsWithHash} from './utils';
API.configure();

API.configure(aws_exports);
const getLineItems = async () => {
  logger.debug(`hitting endpoint GET:${GET_ASSIGNMENT_ENDPOINT}`);
  const lineItems = await API.get(LTI_API_NAME, GET_ASSIGNMENT_ENDPOINT + startParamsWithHash());
    return lineItems;
};

const deleteLineItem = async (assignmentId) => {
  const results = await API.delete(LTI_API_NAME, DELETE_LINE_ITEM, {
    lineItemId: assignmentId,
    hash: getHash()
  });

  return results;
}

export { getLineItems, deleteLineItem };