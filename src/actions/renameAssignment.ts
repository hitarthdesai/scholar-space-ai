"use server";

import {
  EnumRenameAssignmentResult,
  renameAssignmentFormSchema,
} from "@/schemas/assignmentSchema";

import { auth } from "@/utils/auth/config";
import { renameAssignmentInDb } from "@/utils/classroom/renameAssignmentInDb";
import { createSafeActionClient } from "next-safe-action";

export const renameAssignment = createSafeActionClient()
  .schema(renameAssignmentFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { assignmentId, newName } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumRenameAssignmentResult.NotAuthorized };
      }

      await renameAssignmentInDb({
        assignmentId: assignmentId,
        newName: newName,
      });

      return { type: EnumRenameAssignmentResult.AssignmentRenamed };
    } catch (e) {
      console.error(e);
      return { type: EnumRenameAssignmentResult.Error };
    }
  });
