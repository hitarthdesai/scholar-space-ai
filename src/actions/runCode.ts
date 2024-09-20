"use server";

import { codeExecutionResultSchema } from "@/schemas/codeSchema";
import {
  EnumRunCodeResult,
  runCodeInputSchema,
} from "@/schemas/questionSchema";
import { createSafeActionClient } from "next-safe-action";
import { getCodeOutput } from "./getCodeOutput";

export const runCode = createSafeActionClient()
  .schema(runCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      // TODO: We will use this later on to get solutions, etc from the database
      const { code } = parsedInput;

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
