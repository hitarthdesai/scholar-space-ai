import {
  type addCodeQuestionFormSchema,
  type addMultiCorrectMCQQuestionFormSchema,
  type addSingleCorrectMCQQuestionFormSchema,
  type EnumQuestionType,
  type QuestionType,
} from "@/schemas/questionSchema";
import { type Dispatch, type SetStateAction } from "react";
import { type z } from "zod";

export type ExtractQuestionForm<T extends QuestionType> =
  T extends typeof EnumQuestionType.Code
    ? z.infer<typeof addCodeQuestionFormSchema>
    : T extends typeof EnumQuestionType.SingleCorrectMcq
      ? z.infer<typeof addSingleCorrectMCQQuestionFormSchema>
      : T extends typeof EnumQuestionType.MultiCorrectMcq
        ? z.infer<typeof addMultiCorrectMCQQuestionFormSchema>
        : never;

export type WithCloseFormSheetMethod<T> = T & {
  closeSheet: () => void;
};

export type WithCloseQuestionTypeDialogMethod<T> = T & {
  closeQuestionTypeDialog: () => void;
};
