"use server";

import {
  EnumSaveCodeResult,
  saveCodeInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { createSafeActionClient } from "next-safe-action";

export const saveCode = createSafeActionClient()
  .schema(saveCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumSaveCodeResult.NotAuthorized };
      }

      const { questionId, code } = parsedInput;

      const fileName = `questionAttempts/${questionId}/${userId}`;
      const buffer = Buffer.from(code, "utf-8");
      const didSaveSucceed = await putObject({
        body: buffer,
        fileName,
        contentType: "text/plain",
      });

      return {
        type: didSaveSucceed
          ? EnumSaveCodeResult.CodeSaved
          : EnumSaveCodeResult.NotUploaded,
      };
    } catch (e) {
      console.error(e);
      return { type: EnumSaveCodeResult.Error };
    }
  });
