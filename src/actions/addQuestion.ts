"use server";

import {
  addQuestionFormSchema,
  EnumAddQuestionResult,
  EnumQuestionType,
} from "@/schemas/questionSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { createSafeActionClient } from "next-safe-action";
import { addCodeQuestion } from "@/utils/classroom/question/addCodeQuestion";
import { addSingleCorrectMcq } from "@/utils/classroom/question/addSingleCorrectMcq";
import { addMultiCorrectMcq } from "@/utils/classroom/question/addMultiCorrectMcq";

export const addQuestion = createSafeActionClient()
  .schema(addQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      const isAuthorized = await canUserAccessAssignment({
        assignmentId: parsedInput.assignmentId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      switch (parsedInput.type) {
        case EnumQuestionType.Code:
          return addCodeQuestion(parsedInput);
        case EnumQuestionType.SingleCorrectMcq:
          return addSingleCorrectMcq(parsedInput);
        case EnumQuestionType.MultiCorrectMcq:
          console.log("parsedInput", parsedInput);
          return addMultiCorrectMcq(parsedInput);
        default:
          return { type: EnumAddQuestionResult.Error };
      }
    } catch (e) {
      console.error(e);
      return { type: EnumAddQuestionResult.Error };
    }
  });
