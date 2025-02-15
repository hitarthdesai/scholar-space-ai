import {
  addCodeQuestionFormSchema,
  addMultiCorrectMCQQuestionFormSchema,
  addSingleCorrectMCQQuestionFormSchema,
  EnumQuestionType,
  QuestionType,
} from "@/schemas/questionSchema";
import { z } from "zod";

export type ExtractQuestionForm<T extends QuestionType> =
  T extends typeof EnumQuestionType.Code
    ? z.infer<typeof addCodeQuestionFormSchema>
    : T extends typeof EnumQuestionType.SingleCorrectMcq
      ? z.infer<typeof addSingleCorrectMCQQuestionFormSchema>
      : T extends typeof EnumQuestionType.MultiCorrectMcq
        ? z.infer<typeof addMultiCorrectMCQQuestionFormSchema>
        : never;
