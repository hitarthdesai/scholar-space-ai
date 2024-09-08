import {
  CLASSROOM_NAME_MAX_LENGTH,
  CLASSROOM_NAME_MIN_LENGTH,
} from "@/utils/constants/classroom";
import { z } from "zod";
import { assignmentSchema } from "./assignmentSchema";

export const classroomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Classroom = z.infer<typeof classroomSchema>;

export const createClassroomFormSchema = z.object({
  name: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type CreateClassroomForm = z.infer<typeof createClassroomFormSchema>;

export const EnumCreateClassroomResult = {
  ClassroomCreated: "classroomCreated",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const createClassroomResultSchema = z.nativeEnum(EnumCreateClassroomResult);
export type CreateClassroomResult = z.infer<typeof createClassroomResultSchema>;

export const classroomDetailsSchema = classroomSchema.extend({
  assignments: z.array(assignmentSchema).nullable(),
});

export type ClassroomDetails = z.infer<typeof classroomDetailsSchema>;

export const deleteClassroomInputSchema = z.object({
  classroomId: z.string().min(1),
});

export type DeleteClassroomInput = z.infer<typeof deleteClassroomInputSchema>;

export const EnumDeleteClassroomResult = {
  ClassroomDeleted: "classroomDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteClassroomResultSchema = z.nativeEnum(EnumDeleteClassroomResult);
export type DeleteClassroomResult = z.infer<typeof deleteClassroomResultSchema>;

export const renameClassroomFormSchema = z.object({
  classroomId: z.string().min(1),
  newName: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type RenameClassroomForm = z.infer<typeof renameClassroomFormSchema>;

export const EnumRenameClassroomResult = {
  ClassroomRenamed: "classroomRenamed",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const renameClassroomResultSchema = z.nativeEnum(EnumRenameClassroomResult);
export type RenameClassroomResult = z.infer<typeof renameClassroomResultSchema>;
