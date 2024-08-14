"use server";

import {
  addQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/assignmentSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { addQuestionToDb } from "@/utils/classroom/addQuestionToDb";
import { createSafeActionClient } from "next-safe-action";

export const addQuestion = createSafeActionClient()
  .schema(addQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { question, assignmentId } = parsedInput;
      await addQuestionToDb({
        question,
        assignmentId,
      });

      return { type: EnumAddQuestionResult.QuestionAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddQuestionResult.Error };
    }
  });
