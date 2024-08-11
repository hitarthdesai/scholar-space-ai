import {
  CLASSROOM_NAME_MAX_LENGTH,
  CLASSROOM_NAME_MIN_LENGTH,
} from "@/utils/constants/classroom";
import { z } from "zod";

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
