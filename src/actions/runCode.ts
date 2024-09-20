"use server";

import { codeExecutionResultSchema } from "@/schemas/codeSchema";
import {
  EnumRunCodeResult,
  runCodeInputSchema,
} from "@/schemas/questionSchema";
import { createSafeActionClient } from "next-safe-action";
import { getCodeOutput } from "./getCodeOutput";
import { getObject } from "@/utils/storage/s3/getObject";
import { auth } from "@/utils/auth/config";

export const runCode = createSafeActionClient()
  .schema(runCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      // TODO: We will use this later on to get solutions, etc from the database
      const { questionId } = parsedInput;
      const session = await auth();
      const userId = session?.user?.id;

      let code = await getObject({
        fileName: `questionAttempts/${questionId}/${userId}`,
      });
      if (!code) {
        return { type: EnumRunCodeResult.InsufficientCodeLength };
      }

      const res = await getCodeOutput(code);

      const { code: status, output } = codeExecutionResultSchema.parse(
        await res.json()
      ).run;

      if (status === 1) {
        return { type: EnumRunCodeResult.CodeRanWithErrors, output };
      }

      return { type: EnumRunCodeResult.CodeRanSuccessfully, output };
    } catch (e) {
      console.error(e);
      return { type: EnumRunCodeResult.Error };
    }
  });
