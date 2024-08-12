"use server";

import {
  addStudentFormSchema,
  EnumAddStudentResult,
} from "@/schemas/studentSchema";
import { EnumRole } from "@/schemas/userSchema";
import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const addStudent = createSafeActionClient()
  .schema(addStudentFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumAddStudentResult.NotAuthorized };
      }

      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { classroomId } = parsedInput;
      const _classrooms = await db
        .select()
        .from(classrooms)
        .where(
          and(
            eq(classrooms.id, classroomId as string),
            eq(classrooms.teacherId, userId)
          )
        );

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
