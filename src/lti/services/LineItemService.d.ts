import { LineItem } from "@asu-etx/rl-shared";
declare const getLineItems: () => Promise<LineItem[]>;
declare const deleteLineItem: (assignmentId: string) => Promise<any>;
export { getLineItems, deleteLineItem };
