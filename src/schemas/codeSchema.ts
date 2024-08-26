import { z } from "zod";

export const codeExecutionResultSchema = z.object({
  run: z.object({
    code: z.union([z.literal(0), z.literal(1)]),
    stdout: z.string().nullable(),
    stderr: z.string().nullable(),
    signal: z.string().nullable(),
    output: z.string().nullable(),
  }),
});
