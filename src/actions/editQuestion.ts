"use server";

import {
  editQuestionFormSchema,
  EnumEditQuestionResult,
  EnumQuestionType,
} from "@/schemas/questionSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { updateQuestionInDb } from "@/utils/classroom/updateQuestionInDb";
import { editMcq } from "@/utils/classroom/question/editMcq";

export const editQuestion = createSafeActionClient()
  .schema(editQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      const { question, name, id } = parsedInput;
      const isAuthorized = await canUserAccessQuestion({
        questionId: id,
        userId,
        accessType: EnumAccessType.Write,
      });

      if (!isAuthorized) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      if (!!name) {
        await updateQuestionInDb({
          name,
          id,
        });
      }

      if (!!question && question.length > 0) {
        const fileName = `questions/${id}/question.txt`;
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

      switch (parsedInput.type) {
        case EnumQuestionType.Code: {
          if (!!parsedInput.starterCode && parsedInput.starterCode.length > 0) {
            const fileName = `questions/${id}/starterCode.txt`;
            const buffer = Buffer.from(parsedInput.starterCode, "utf-8");
            const didUploadSucceed = await putObject({
              body: buffer,
              fileName,
              contentType: "text/plain",
            });

            if (!didUploadSucceed) {
              return { type: EnumEditQuestionResult.NotUploaded };
            }
          }
          return { type: EnumEditQuestionResult.QuestionEdited };
        }

        case EnumQuestionType.SingleCorrectMcq: {
          if (
            !!parsedInput.options &&
            parsedInput.options.length > 0 &&
            !!parsedInput.correctOption
          ) {
            await editMcq({
              id,
              newOptions: parsedInput.options,
              newCorrectOptions: [parsedInput.correctOption],
            });
          }

          return { type: EnumEditQuestionResult.QuestionEdited };
        }

        case EnumQuestionType.MultiCorrectMcq: {
          if (
            !!parsedInput.options &&
            parsedInput.options.length > 0 &&
            !!parsedInput.correctOptions &&
            parsedInput.correctOptions.length > 0
          ) {
            await editMcq({
              id,
              newOptions: parsedInput.options,
              newCorrectOptions: parsedInput.correctOptions,
            });
          }

          return { type: EnumEditQuestionResult.QuestionEdited };
        }
      }
    } catch (e) {
      console.error(e);
      return { type: EnumEditQuestionResult.Error };
    }
  });
