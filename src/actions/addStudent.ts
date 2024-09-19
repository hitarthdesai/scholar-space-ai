"use server";

import {
  addStudentFormSchema,
  EnumAddStudentResult,
} from "@/schemas/studentSchema";
import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const addStudent = createSafeActionClient()
  .schema(addStudentFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { classroomId } = parsedInput;
      const _classrooms = await db
        .select()
        .from(classrooms)
        .where(and(eq(classrooms.id, classroomId)));

      if (!_classrooms || _classrooms.length === 0) {
        return { type: EnumAddStudentResult.NotAuthorized };
      }

      // TODO: Implement the actual logic to add student here
      return { type: EnumAddStudentResult.StudentAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddStudentResult.Error };
    }
  });
