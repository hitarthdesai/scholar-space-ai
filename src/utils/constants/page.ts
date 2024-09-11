export const EnumPage = {
  Classroom: "Classroom",
  Assignment: "Assignment",
  Question: "Question",
} as const;

export type Page = (typeof EnumPage)[keyof typeof EnumPage];
