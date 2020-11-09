import { Student } from "@asu-etx/rl-shared";
declare const getUsers: (role: string) => Promise<any>;
declare const getUnassignedStudents: (assignmentId: string, resourceLinkId: string) => Promise<Student[]>;
declare const getAssignedStudents: (assignmentId: string, resourceLinkId: string) => Promise<Student[]>;
export { getUsers, getUnassignedStudents, getAssignedStudents };
