export const EnumPage = {
  Classroom: "Classroom",
  ClassroomParticipants: "ClassroomParticipants",
  ClassroomAssignments: "ClassroomAssignments",
  ClassroomFiles: "ClassroomFiles",
  Assignment: "Assignment",
  Question: "Question",
} as const;

export type Page = (typeof EnumPage)[keyof typeof EnumPage];
