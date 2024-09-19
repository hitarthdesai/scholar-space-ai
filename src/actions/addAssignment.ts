"use server";

import {
  addAssignmentFormSchema,
  EnumAddAssignmentResult,
} from "@/schemas/assignmentSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { addAssignmentToDb } from "@/utils/classroom/addAssignmentToDb";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { createSafeActionClient } from "next-safe-action";

export const addAssignment = createSafeActionClient()
  .schema(addAssignmentFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddAssignmentResult.NotAuthorized };
      }

      const { name, classroomId } = parsedInput;
      const isAuthorized = await canUserAccessClassroom({
        classroomId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumAddAssignmentResult.NotAuthorized };
      }

      await addAssignmentToDb({ name, classroomId });
      return { type: EnumAddAssignmentResult.AssignmentAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddAssignmentResult.Error };
    }
  });
