import { SubmitContentItem } from "@asu-etx/rl-shared";
declare const getDeepLinkResourceLinks: () => Promise<any[]>;
declare const submitResourceSelection: (resourceLink: SubmitContentItem) => Promise<any>;
export { getDeepLinkResourceLinks, submitResourceSelection };
