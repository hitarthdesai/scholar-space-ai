"use server";

import {
  EnumDeleteClassroomResult,
  deleteClassroomInputSchema,
} from "@/schemas/classroomSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { deleteClassroomFromDb } from "@/utils/classroom/deleteClassroomFromDb";
import { createSafeActionClient } from "next-safe-action";

export const deleteClassroom = createSafeActionClient()
  .schema(deleteClassroomInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { classroomId } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumDeleteClassroomResult.NotAuthorized };
      }

      const isAuthorized = await canUserAccessClassroom({
        classroomId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumDeleteClassroomResult.NotAuthorized };
      }

      await deleteClassroomFromDb({
        classroomId,
      });

      return { type: EnumDeleteClassroomResult.ClassroomDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteClassroomResult.Error };
    }
  });
