"use server";

import {
  EnumAddClassroomResult,
  addClassroomFormSchema,
} from "@/schemas/classroomSchema";
import { auth } from "@/utils/auth/config";
import { addClassroomToDb } from "@/utils/classroom/addClassroomToDb";
import { createSafeActionClient } from "next-safe-action";

export const addClassroom = createSafeActionClient()
  .schema(addClassroomFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddClassroomResult.NotAuthorized };
      }

      const { name } = parsedInput;
      await addClassroomToDb({
        name,
        adminId: userId,
      });

      return { type: EnumAddClassroomResult.ClassroomAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddClassroomResult.Error };
    }
  });
