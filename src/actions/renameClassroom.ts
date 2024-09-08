"use server";

import {
  EnumRenameClassroomResult,
  renameClassroomFormSchema,
} from "@/schemas/classroomSchema";

import { auth } from "@/utils/auth/config";
import { renameClassroomInDb } from "@/utils/classroom/renameClassroomInDb";
import { createSafeActionClient } from "next-safe-action";

export const renameClassroom = createSafeActionClient()
  .schema(renameClassroomFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { classroomId, newName } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumRenameClassroomResult.NotAuthorized };
      }

      await renameClassroomInDb({
        classroomId: classroomId,
        newName: newName,
      });

      return { type: EnumRenameClassroomResult.ClassroomRenamed };
    } catch (e) {
      console.error(e);
      return { type: EnumRenameClassroomResult.Error };
    }
  });
