"use server";

import {
  EnumEditClassroomResult,
  editClassroomFormSchema,
} from "@/schemas/classroomSchema";

import { auth } from "@/utils/auth/config";
import { editClassroomInDb } from "@/utils/classroom/editClassroomInDb";
import { createSafeActionClient } from "next-safe-action";

export const editClassroom = createSafeActionClient()
  .schema(editClassroomFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { classroomId, newName } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditClassroomResult.NotAuthorized };
      }

      await editClassroomInDb({
        classroomId: classroomId,
        newName: newName,
      });

      return { type: EnumEditClassroomResult.ClassroomEdited };
    } catch (e) {
      console.error(e);
      return { type: EnumEditClassroomResult.Error };
    }
  });
