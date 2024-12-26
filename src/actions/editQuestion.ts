"use server";

import {
  editQuestionFormSchema,
  EnumEditQuestionResult,
} from "@/schemas/questionSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { updateQuestionInDb } from "@/utils/classroom/updateQuestionInDb";

export const editQuestion = createSafeActionClient()
  .schema(editQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      const { question, name, questionId, starterCode } = parsedInput;
      const isAuthorized = await canUserAccessQuestion({
        questionId,
        userId,
        accessType: EnumAccessType.Write,
      });

      if (!isAuthorized) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      if (!!question && question.length > 0) {
        const fileName = `questions/${questionId}/question.txt`;
        const buffer = Buffer.from(question, "utf-8");
        const didUploadSucceed = await putObject({
          body: buffer,
          fileName,
          contentType: "text/plain",
        });

        if (!didUploadSucceed) {
          return { type: EnumEditQuestionResult.NotUploaded };
        }
      }

      if (!!starterCode && starterCode.length > 0) {
        const fileName = `questions/${questionId}/starterCode.txt`;
        const buffer = Buffer.from(starterCode, "utf-8");
        const didUploadSucceed = await putObject({
          body: buffer,
          fileName,
          contentType: "text/plain",
        });

        if (!didUploadSucceed) {
          return { type: EnumEditQuestionResult.NotUploaded };
        }
      }

      if (!!name) {
        await updateQuestionInDb({
          name,
          questionId,
        });
      }

      return { type: EnumEditQuestionResult.QuestionEdited };
    } catch (e) {
      console.error(e);
      return { type: EnumEditQuestionResult.Error };
    }
  });
