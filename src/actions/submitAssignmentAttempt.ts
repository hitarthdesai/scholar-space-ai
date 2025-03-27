"use server";

import {
  EnumSubmitAssignmentAttemptResult,
  submitAssignmentAttemptInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { submitAssignmentAttemptToDb } from "@/utils/classroom/submitAssignmentAttemptToDb";

export const submitAssignmentAttempt = createSafeActionClient()
  .schema(submitAssignmentAttemptInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumSubmitAssignmentAttemptResult.NotAuthorized };
      }

      const { assignmentId } = parsedInput;
      await submitAssignmentAttemptToDb({
        userId,
        assignmentId,
      });

      return { type: EnumSubmitAssignmentAttemptResult.Submitted };
    } catch (e) {
      console.error(e);
      return { type: EnumSubmitAssignmentAttemptResult.Error };
    }
  });
