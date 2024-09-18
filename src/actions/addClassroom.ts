"use server";

import {
  EnumAddClassroomResult,
  addClassroomFormSchema,
} from "@/schemas/classroomSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { addClassroomToDb } from "@/utils/classroom/addClassroomToDb";
import { createSafeActionClient } from "next-safe-action";

export const addClassroom = createSafeActionClient()
  .schema(addClassroomFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumAddClassroomResult.NotAuthorized };
      }

      const { name } = parsedInput;
      await addClassroomToDb({
        name,
        teacherId: userId,
      });

      return { type: EnumAddClassroomResult.ClassroomAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddClassroomResult.Error };
    }
  });
