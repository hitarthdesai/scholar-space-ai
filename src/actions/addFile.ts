"use server";

import { addFileFormSchema, EnumAddFileResult } from "@/schemas/fileSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { addQuestionToDb } from "@/utils/classroom/addQuestionToDb";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";
import { createSafeActionClient } from "next-safe-action";

export const addFile = createSafeActionClient()
  .schema(addFileFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddFileResult.NotAuthorized };
      }

      const { file, name } = parsedInput;

      console.log(file, name);
      return { type: EnumAddFileResult.FileAdded };

      //   const isAuthorized = await canUserAccessAssignment({
      //     assignmentId,
      //     userId,
      //     accessType: EnumAccessType.Write,
      //   });
      //   if (!isAuthorized) {
      //     return { type: EnumAddFileResult.NotAuthorized };
      //   }

      //   const newQuestionId = randomUUID();
      //   const questionTextFileName = `questions/${newQuestionId}/question.txt`;
      //   const questionTextBuffer = Buffer.from(question, "utf-8");
      //   const didQuestionTextUploadSucceed = await putObject({
      //     body: questionTextBuffer,
      //     fileName: questionTextFileName,
      //     contentType: "text/plain",
      //   });

      //   if (!didQuestionTextUploadSucceed) {
      //     return { type: EnumAddFileResult.NotUploaded };
      //   }

      //   const starterCodeFileName = `questions/${newQuestionId}/starterCode.txt`;
      //   const starterCodeBuffer = Buffer.from(starterCode, "utf-8");
      //   const didStarterCodeUploadSucceed = await putObject({
      //     body: starterCodeBuffer,
      //     fileName: starterCodeFileName,
      //     contentType: "text/plain",
      //   });

      //   if (!didStarterCodeUploadSucceed) {
      //     return { type: EnumAddFileResult.NotUploaded };
      //   }

      //   await addQuestionToDb({
      //     questionId: newQuestionId,
      //     name,
      //     assignmentId,
      //   });

      //   return { type: EnumAddFileResult.QuestionAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddFileResult.Error };
    }
  });
