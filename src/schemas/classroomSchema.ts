import {
  CLASSROOM_NAME_MAX_LENGTH,
  CLASSROOM_NAME_MIN_LENGTH,
} from "@/utils/constants/classroom";
import { z } from "zod";
import { assignmentSchema } from "./assignmentSchema";
import { EnumFormMode } from "./formSchema";

export const classroomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Classroom = z.infer<typeof classroomSchema>;

export const addEditClassroomSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
    classroom: classroomSchema,
  }),
]);

export type AddEditClassroomSheetProps = z.infer<
  typeof addEditClassroomSheetPropsSchema
>;

export const addClassroomFormSchema = z.object({
  name: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type AddClassroomForm = z.infer<typeof addClassroomFormSchema>;

export const EnumAddClassroomResult = {
  ClassroomAdded: "classroomCreated",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const createClassroomResultSchema = z.nativeEnum(EnumAddClassroomResult);
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

export const editClassroomFormSchema = z.object({
  classroomId: z.string().min(1),
  newName: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type EditClassroomForm = z.infer<typeof editClassroomFormSchema>;

export const EnumEditClassroomResult = {
  ClassroomEdited: "classroomEdited",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const editClassroomResultSchema = z.nativeEnum(EnumEditClassroomResult);
export type EditClassroomResult = z.infer<typeof editClassroomResultSchema>;
