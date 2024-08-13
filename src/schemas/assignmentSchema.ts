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
