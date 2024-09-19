"use server";

import {
  EnumEditAssignmentResult,
  editAssignmentFormSchema,
} from "@/schemas/assignmentSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";

import { auth } from "@/utils/auth/config";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { editAssignmentInDb } from "@/utils/classroom/editAssignmentInDb";
import { createSafeActionClient } from "next-safe-action";

export const editAssignment = createSafeActionClient()
  .schema(editAssignmentFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditAssignmentResult.NotAuthorized };
      }

      const { assignmentId, newName } = parsedInput;
      const isAuthorized = await canUserAccessAssignment({
        assignmentId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumEditAssignmentResult.NotAuthorized };
      }

      await editAssignmentInDb({
        assignmentId: assignmentId,
        newName: newName,
      });

      return { type: EnumEditAssignmentResult.AssignmentEdited };
    } catch (e) {
      console.error(e);
      return { type: EnumEditAssignmentResult.Error };
    }
  });
