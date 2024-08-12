"use server";

import {
  EnumDeleteClassroomResult,
  deleteClassroomInputSchema,
} from "@/schemas/classroomSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { deleteClassroomFromDb } from "@/utils/classroom/deleteClassroomFromDb";
import { createSafeActionClient } from "next-safe-action";

export const deleteClassroom = createSafeActionClient()
  .schema(deleteClassroomInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { classroomId } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumDeleteClassroomResult.NotAuthorized };
      }

      await deleteClassroomFromDb({
        classroomId,
        teacherId: userId,
      });

      return { type: EnumDeleteClassroomResult.ClassroomDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteClassroomResult.Error };
    }
  });
