import { SubmitGradeParams, InstructorSubmitGradeParams } from "@asu-etx/rl-shared";
declare const submitGrade: (params: SubmitGradeParams) => Promise<any>;
declare const submitInstructorGrade: (params: InstructorSubmitGradeParams) => Promise<any>;
declare const getGrades: (assignmentId: string) => Promise<any>;
export { submitGrade, getGrades, submitInstructorGrade };
