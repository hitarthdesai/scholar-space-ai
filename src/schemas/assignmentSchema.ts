import { z } from "zod";
import {
  ASSIGNMENT_NAME_MAX_LENGTH,
  ASSIGNMENT_NAME_MIN_LENGTH,
} from "@/utils/constants/assignment";
import { EnumFormMode } from "./formSchema";

export const assignmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Assignment = z.infer<typeof assignmentSchema>;

export const addEditAssignmentSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
    classroomId: z.string().min(1),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
    assignment: assignmentSchema,
  }),
]);

export type AddEditAssignmentSheetProps = z.infer<
  typeof addEditAssignmentSheetPropsSchema
>;

export const addAssignmentFormSchema = z.object({
  name: z
    .string()
    .min(ASSIGNMENT_NAME_MIN_LENGTH)
    .max(ASSIGNMENT_NAME_MAX_LENGTH),
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

export const renameAssignmentFormSchema = z.object({
  assignmentId: z.string().min(1),
  newName: z
    .string()
    .min(ASSIGNMENT_NAME_MIN_LENGTH)
    .max(ASSIGNMENT_NAME_MAX_LENGTH),
});

export type RenameAssignmentForm = z.infer<typeof renameAssignmentFormSchema>;

export const EnumRenameAssignmentResult = {
  AssignmentRenamed: "assignmentRenamed",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const renameAssignmentResultSchema = z.nativeEnum(EnumRenameAssignmentResult);
export type RenameAssignmentResult = z.infer<
  typeof renameAssignmentResultSchema
>;
