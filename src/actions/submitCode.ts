"use server";

import {
  EnumSubmitCodeResult,
  submitCodeInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { createSafeActionClient } from "next-safe-action";
import { db } from "@/server/db";
import { questionAttempts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const submitCode = createSafeActionClient()
  .schema(submitCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumSubmitCodeResult.NotAuthorized };
      }

      const { questionId, code } = parsedInput;
      const fileName = `questionSubmissions/${questionId}/${userId}/submission`;
      const buffer = Buffer.from(code, "utf-8");
      const didSubmitSucceed = await putObject({
        body: buffer,
        fileName,
        contentType: "text/plain",
      });

      if (!didSubmitSucceed) {
        return { type: EnumSubmitCodeResult.Error };
      }

      await db
        .update(questionAttempts)
        .set({ submitted: new Date() })
        .where(
          and(
            eq(questionAttempts.userId, userId),
            eq(questionAttempts.questionId, questionId)
          )
        );

      return { type: EnumSubmitCodeResult.CodeSubmitted };
    } catch (e) {
      console.error(e);
      return { type: EnumSubmitCodeResult.Error };
    }
  });
