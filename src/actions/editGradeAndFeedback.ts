"use server";

import { EnumEditGradeAndFeedbackResult } from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { gradeAndFeedbackFormSchema } from "@/schemas/questionSchema";
import { editGradeAndFeedbackInDb } from "@/utils/classroom/question/editGradeAndFeedbackInDb";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";

export const editGradeAndFeedback = createSafeActionClient()
  .schema(gradeAndFeedbackFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditGradeAndFeedbackResult.NotAuthorized };
      }

      const isAuthorized = await canUserAccessQuestion({
        questionId: parsedInput.questionId,
        userId,
        accessType: EnumAccessType.Write,
      });

      if (!isAuthorized) {
        return { type: EnumEditGradeAndFeedbackResult.NotAuthorized };
      }

      await editGradeAndFeedbackInDb(parsedInput);
      return { type: EnumEditGradeAndFeedbackResult.GradedSuccessfully };
    } catch (e) {
      console.error(e);
      return { type: EnumEditGradeAndFeedbackResult.Error };
    }
  });
