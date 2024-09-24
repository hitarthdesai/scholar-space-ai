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

      const code = await getObject({
        fileName: `questionAttempts/${questionId}/${userId}`,
      });
      if (!code) {
        return { type: EnumRunCodeResult.InsufficientCodeLength };
      }

      const { status, output } = await getCodeOutput(code);

      if (status === 1) {
        return { type: EnumRunCodeResult.CodeRanWithErrors, output };
      }

      const fileName = `questionAttemptOutputs/${questionId}/${userId}`;
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
