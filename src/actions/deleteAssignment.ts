"use server";

import {
  EnumDeleteAssignmentResult,
  deleteAssignmentInputSchema,
} from "@/schemas/assignmentSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { deleteAssignmentFromDb } from "@/utils/classroom/deleteAssignmentFromDb";
import { createSafeActionClient } from "next-safe-action";

export const deleteAssignment = createSafeActionClient()
  .schema(deleteAssignmentInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumDeleteAssignmentResult.NotAuthorized };
      }

      const { assignmentId } = parsedInput;
      const isAuthorized = await canUserAccessAssignment({
        assignmentId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumDeleteAssignmentResult.NotAuthorized };
      }

      await deleteAssignmentFromDb({ assignmentId });
      return { type: EnumDeleteAssignmentResult.AssignmentDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteAssignmentResult.Error };
    }
  });
