"use server";

import { codeExecutionResultSchema } from "@/schemas/codeSchema";
import {
  EnumRunCodeResult,
  runCodeInputSchema,
} from "@/schemas/questionSchema";
import { createSafeActionClient } from "next-safe-action";
import fetch from "node-fetch";

export const runCode = createSafeActionClient()
  .schema(runCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      // TODO: We will use this later on to get solutions, etc from the database
      const { code } = parsedInput;

      const url = new URL(process.env.PISTON_URL ?? "");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "python",
          version: "3.10.0",
          files: [
            {
              name: "main",
              content: code,
            },
          ],
        }),
      });

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
