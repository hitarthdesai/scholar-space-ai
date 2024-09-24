export const EnumPage = {
  Classroom: "Classroom",
  Assignment: "Assignment",
  Question: "Question",
  ClassroomParticipants: "ClassroomParticipants",
} as const;

export type Page = (typeof EnumPage)[keyof typeof EnumPage];
