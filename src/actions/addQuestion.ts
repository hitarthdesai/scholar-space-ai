"use server";

import {
  addQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/assignmentSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumRole } from "@/schemas/userSchema";
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
      if (!userId || session?.user?.role !== EnumRole.Teacher) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      const { question, assignmentId } = parsedInput;
      const isAuthorized = await canUserAccessAssignment({
        assignmentId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumAddQuestionResult.NotAuthorized };
      }

      const newQuestionId = randomUUID();
      const fileName = `questions/${newQuestionId}`;
      const buffer = Buffer.from(question, "utf-8");
      const didUploadSucceed = await putObject({
        body: buffer,
        fileName,
        contentType: "text/plain",
      });

      if (!didUploadSucceed) {
        return { type: EnumAddQuestionResult.NotUploaded };
      }

      await addQuestionToDb({
        questionId: newQuestionId,
        assignmentId,
      });

      return { type: EnumAddQuestionResult.QuestionAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddQuestionResult.Error };
    }
  });
