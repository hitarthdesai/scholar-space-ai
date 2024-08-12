import { z } from "zod";

export const studentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export type Student = z.infer<typeof studentSchema>;

export const addStudentFormSchema = z.object({
  classroomId: z.string().min(1),
  email: z.string().email(),
});

export type AddStudentForm = z.infer<typeof addStudentFormSchema>;

export const EnumAddStudentResult = {
  StudentAdded: "studentAdded",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const addStudentResultSchema = z.nativeEnum(EnumAddStudentResult);
export type AddStudentResult = z.infer<typeof addStudentResultSchema>;
