export const EnumPage = {
  Classroom: "Classroom",
  ClassroomParticipants: "ClassroomParticipants",
  ClassroomAssignments: "ClassroomAssignments",
  Assignment: "Assignment",
  Question: "Question",
} as const;

export type Page = (typeof EnumPage)[keyof typeof EnumPage];
