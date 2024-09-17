export const EnumPage = {
  Classroom: "Classroom",
  Assignment: "Assignment",
  Question: "Question",
  ClassroomInvitations: "ClassroomInvitations",
} as const;

export type Page = (typeof EnumPage)[keyof typeof EnumPage];
