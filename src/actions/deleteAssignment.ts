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
      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { assignmentId } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumDeleteAssignmentResult.NotAuthorized };
      }

      await deleteAssignmentFromDb({ assignmentId });

      return { type: EnumDeleteAssignmentResult.AssignmentDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteAssignmentResult.Error };
    }
  });
