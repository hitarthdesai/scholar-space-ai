import { z } from "zod";

export const addAssignmentFormSchema = z.object({
  name: z.string().min(1),
  classroomId: z.string().min(1),
});

export type AddAssignmentForm = z.infer<typeof addAssignmentFormSchema>;

export const EnumAddAssignmentResult = {
  AssignmentAdded: "assignmentAdded",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const addAssignmentResultSchema = z.nativeEnum(EnumAddAssignmentResult);
export type AddAssignmentResult = z.infer<typeof addAssignmentResultSchema>;

export const assignmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Assignment = z.infer<typeof assignmentSchema>;

export const deleteAssignmentInputSchema = z.object({
  assignmentId: z.string().min(1),
});

export type DeleteAssignmentInput = z.infer<typeof deleteAssignmentInputSchema>;

export const EnumDeleteAssignmentResult = {
  AssignmentDeleted: "assignmentDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteAssignmentResultSchema = z.nativeEnum(EnumDeleteAssignmentResult);
export type DeleteAssignmentResult = z.infer<
  typeof deleteAssignmentResultSchema
>;

export const addQuestionFormSchema = z.object({
  assignmentId: z.string().min(1),
  question: z.string().min(1),
});

export type AddQuestionForm = z.infer<typeof addQuestionFormSchema>;

export const EnumAddQuestionResult = {
  QuestionAdded: "QuestionAdded",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const addQuestionResultSchema = z.nativeEnum(EnumAddQuestionResult);
export type AddQuestionResult = z.infer<typeof addQuestionResultSchema>;
