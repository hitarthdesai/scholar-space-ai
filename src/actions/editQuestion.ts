"use server";

import {
  editQuestionFormSchema,
  EnumEditQuestionResult,
} from "@/schemas/questionSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { updateQuestionToDb } from "@/utils/classroom/updateQuestionInDb";

export const editQuestion = createSafeActionClient()
  .schema(editQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      const { question, name, questionId } = parsedInput;
      const isAuthorized = await canUserAccessQuestion({
        questionId,
        userId,
        accessType: EnumAccessType.Write,
      });

      if (!isAuthorized) {
        return { type: EnumEditQuestionResult.NotAuthorized };
      }

      if (!!question) {
        const fileName = `questions/${questionId}`;
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

      if (!!name) {
        await updateQuestionToDb({
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
