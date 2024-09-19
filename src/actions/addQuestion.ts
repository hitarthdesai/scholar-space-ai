"use server";

import {
  addQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/questionSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { addQuestionToDb } from "@/utils/classroom/addQuestionToDb";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";
import { createSafeActionClient } from "next-safe-action";

export const addQuestion = createSafeActionClient()
  .schema(addQuestionFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      const { question, name, assignmentId, starterCode } = parsedInput;
      const isAuthorized = await canUserAccessAssignment({
        assignmentId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      const newQuestionId = randomUUID();
      const questionTextFileName = `questions/${newQuestionId}/question.txt`;
      const questionTextBuffer = Buffer.from(question, "utf-8");
      const didQuestionTextUploadSucceed = await putObject({
        body: questionTextBuffer,
        fileName: questionTextFileName,
        contentType: "text/plain",
      });

      if (!didQuestionTextUploadSucceed) {
        return { type: EnumAddQuestionResult.NotUploaded };
      }

      const starterCodeFileName = `questions/${newQuestionId}/starterCode.txt`;
      const starterCodeBuffer = Buffer.from(starterCode, "utf-8");
      const didStarterCodeUploadSucceed = await putObject({
        body: starterCodeBuffer,
        fileName: starterCodeFileName,
        contentType: "text/plain",
      });

      if (!didStarterCodeUploadSucceed) {
        return { type: EnumAddQuestionResult.NotUploaded };
      }

      await addQuestionToDb({
        questionId: newQuestionId,
        name,
        assignmentId,
      });

      return { type: EnumAddQuestionResult.QuestionAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddQuestionResult.Error };
    }
  });
