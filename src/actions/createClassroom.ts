"use server";

import {
  EnumCreateClassroomResult,
  createClassroomFormSchema,
} from "@/schemas/classroomSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { createClassroomInDb } from "@/utils/classroom/createClassroomInDb";
import { createSafeActionClient } from "next-safe-action";

export const createClassroom = createSafeActionClient()
  .schema(createClassroomFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumCreateClassroomResult.NotAuthorized };
      }

      const { name } = parsedInput;
      await createClassroomInDb({
        name,
        teacherId: userId,
      });

      return { type: EnumCreateClassroomResult.ClassroomCreated };
    } catch (e) {
      console.error(e);
      return { type: EnumCreateClassroomResult.Error };
    }
  });
