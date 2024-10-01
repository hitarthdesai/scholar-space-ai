"use server";

import {
  EnumRunCodeResult,
  runCodeInputSchema,
} from "@/schemas/questionSchema";
import { createSafeActionClient } from "next-safe-action";
import { getCodeOutput } from "../utils/chat/getCodeOutput";
import { getObject } from "@/utils/storage/s3/getObject";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";

export const runCode = createSafeActionClient()
  .schema(runCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { questionId } = parsedInput;
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return { type: EnumRunCodeResult.Error };
      }

      const code = await getObject({
        fileName: `questionAttempts/${questionId}/${userId}/solution`,
      });
      if (!code) {
        return { type: EnumRunCodeResult.InsufficientCodeLength };
      }

      const { status, output } = await getCodeOutput(code);

      if (status === 1) {
        return { type: EnumRunCodeResult.CodeRanWithErrors, output };
      }

      const fileName = `questionAttempts/${questionId}/${userId}/output`;
      const buffer = Buffer.from(output ?? "", "utf-8");
      const didSaveSucceed = await putObject({
        body: buffer,
        fileName,
        contentType: "text/plain",
      });

      if (!didSaveSucceed) {
        return { type: EnumRunCodeResult.Error };
      }

      return { type: EnumRunCodeResult.CodeRanSuccessfully, output };
    } catch (e) {
      console.error(e);
      return { type: EnumRunCodeResult.Error };
    }
  });
