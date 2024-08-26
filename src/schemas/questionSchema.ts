import { z } from "zod";

export const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
});

export type Question = z.infer<typeof questionSchema>;

export const runCodeInputSchema = z.object({
  questionId: z.string().min(1),
  code: z.string().min(1),
});

export const EnumRunCodeResult = {
  CodeRanSuccessfully: "CodeRanSuccessfully",
  CodeRanWithErrors: "CodeRanWithErrors",
  Error: "error",
} as const;

const runCodeResultSchema = z.nativeEnum(EnumRunCodeResult);
export type RunCodeResult = z.infer<typeof runCodeResultSchema>;
