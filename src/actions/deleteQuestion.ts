"use server";

import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import {
  EnumDeleteQuestionResult,
  deleteQuestionInputSchema,
} from "@/schemas/questionSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { deleteQuestionFromDb } from "@/utils/classroom/deleteQuestionFromDb";
import { createSafeActionClient } from "next-safe-action";

export const deleteQuestion = createSafeActionClient()
  .schema(deleteQuestionInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumDeleteQuestionResult.NotAuthorized };
      }

      const { questionId } = parsedInput;
      const isAuthorized = await canUserAccessQuestion({
        questionId,
        userId,
        accessType: EnumAccessType.Write,
      });

      if (!isAuthorized) {
        return { type: EnumDeleteQuestionResult.NotAuthorized };
      }

      await deleteQuestionFromDb({ questionId });
      return { type: EnumDeleteQuestionResult.QuestionDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteQuestionResult.Error };
    }
  });
