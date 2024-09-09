"use server";

import {
  EnumDeleteAssignmentResult,
  deleteAssignmentInputSchema,
} from "@/schemas/assignmentSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { deleteAssignmentFromDb } from "@/utils/classroom/deleteAssignmentFromDb";
import { createSafeActionClient } from "next-safe-action";

export const deleteAssignment = createSafeActionClient()
  .schema(deleteAssignmentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumDeleteAssignmentResult.NotAuthorized };
      }

      const { assignmentId } = parsedInput;
      await deleteAssignmentFromDb({ assignmentId });

      return { type: EnumDeleteAssignmentResult.AssignmentDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteAssignmentResult.Error };
    }
  });
