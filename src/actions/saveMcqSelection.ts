"use server";

import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import {
  EnumQuestionType,
  EnumSaveMcqSelectionResult,
  saveMcqSelectionInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { saveMcqSelectionInDb } from "@/utils/classroom/question/saveMcqSelectionInDb";
import { createSafeActionClient } from "next-safe-action";

export const saveMcqSelection = createSafeActionClient()
  .schema(saveMcqSelectionInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumSaveMcqSelectionResult.NotAuthorized };
      }

      const isAuthorized = await canUserAccessQuestion({
        questionId: parsedInput.questionId,
        userId,
        accessType: EnumAccessType.Read,
      });

      if (!isAuthorized) {
        return { type: EnumSaveMcqSelectionResult.NotAuthorized };
      }

      const optionsToSave =
        parsedInput.type === EnumQuestionType.SingleCorrectMcq
          ? [parsedInput.selectedOption]
          : parsedInput.selectedOptions;

      await saveMcqSelectionInDb({
        questionId: parsedInput.questionId,
        userId,
        selectedOptions: optionsToSave,
      });

      return { type: EnumSaveMcqSelectionResult.McqSelectionSaved };
    } catch (e) {
      console.error(e);
      return { type: EnumSaveMcqSelectionResult.Error };
    }
  });
