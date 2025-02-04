"use server";

import {
  EnumSubmitCodeResult,
  submitCodeInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { submitQuestionAttemptToDb } from "@/utils/classroom/submitQuestionAttemptToDb";

export const submitCode = createSafeActionClient()
  .schema(submitCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumSubmitCodeResult.NotAuthorized };
      }

      const { questionId } = parsedInput;
      await submitQuestionAttemptToDb({
        userId,
        questionId,
      });

      return { type: EnumSubmitCodeResult.CodeSubmitted };
    } catch (e) {
      console.error(e);
      return { type: EnumSubmitCodeResult.Error };
    }
  });
