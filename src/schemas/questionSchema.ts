import { z } from "zod";
import { EnumFormMode } from "./formSchema";
import { Question } from "@/components/question/Question";

const QUESTION_NAME_MIN_LENGTH = 5;
const QUESTION_NAME_MAX_LENGTH = 50;
const QUESTION_TEXT_MIN_LENGTH = 10;
const QUESTION_TEXT_MAX_LENGTH = 500;
const STARTER_CODE_MIN_LENGTH = 10;
const STARTER_CODE_MAX_LENGTH = 500;

export const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
});

export type Question = z.infer<typeof questionSchema>;

export const editFormDefaultValuesSchema = z.tuple([
  z.object({
    id: z.string().min(1),
    name: z
      .string()
      .min(QUESTION_NAME_MIN_LENGTH)
      .max(QUESTION_NAME_MAX_LENGTH),
  }),
  z
    .string()
    .min(QUESTION_NAME_MIN_LENGTH)
    .max(QUESTION_NAME_MAX_LENGTH)
    .optional(),
  z
    .string()
    .min(STARTER_CODE_MIN_LENGTH)
    .max(STARTER_CODE_MAX_LENGTH)
    .optional(),
]);

export type EditFormDefaultValues = z.infer<typeof editFormDefaultValuesSchema>;

export const addEditQuestionSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
    assignmentId: z.string().min(1),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
    editPromise: z.promise(editFormDefaultValuesSchema),
  }),
]);

export type AddEditQuestionSheetProps = z.infer<
  typeof addEditQuestionSheetPropsSchema
>;

export const addQuestionFormSchema = z.object({
  assignmentId: z.string().min(1),
  name: z.string().min(QUESTION_NAME_MIN_LENGTH).max(QUESTION_NAME_MAX_LENGTH),
  question: z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH),
  starterCode: z
    .string()
    .min(STARTER_CODE_MIN_LENGTH)
    .max(STARTER_CODE_MAX_LENGTH),
});

export type AddQuestionForm = z.infer<typeof addQuestionFormSchema>;

export const EnumAddQuestionResult = {
  QuestionAdded: "QuestionAdded",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

const addQuestionResultSchema = z.nativeEnum(EnumAddQuestionResult);
export type AddQuestionResult = z.infer<typeof addQuestionResultSchema>;

export const editQuestionFormSchema = z.object({
  questionId: z.string().min(1),
  name: z
    .string()
    .min(QUESTION_NAME_MIN_LENGTH)
    .max(QUESTION_NAME_MAX_LENGTH)
    .optional(),
  question: z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH)
    .optional(),
  starterCode: z
    .string()
    .min(STARTER_CODE_MIN_LENGTH)
    .max(STARTER_CODE_MAX_LENGTH)
    .optional(),
});

export type EditQuestionForm = z.infer<typeof editQuestionFormSchema>;

export const EnumEditQuestionResult = {
  QuestionEdited: "QuestionEdited",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

export const editQuestionResultSchema = z.nativeEnum(EnumEditQuestionResult);
export type EditQuestionResult = z.infer<typeof editQuestionResultSchema>;

export const deleteQuestionInputSchema = z.object({
  questionId: z.string().min(1),
});

export const EnumDeleteQuestionResult = {
  QuestionDeleted: "QuestionDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteQuestionResultSchema = z.nativeEnum(EnumDeleteQuestionResult);
export type DeleteQuestionResult = z.infer<typeof deleteQuestionResultSchema>;

export const runCodeInputSchema = z.object({
  questionId: z.string().min(1),
  code: z.string().min(1),
});

export const EnumRunCodeResult = {
  CodeRanSuccessfully: "codeRanSuccessfully",
  CodeRanWithErrors: "codeRanWithErrors",
  Error: "error",
} as const;

const runCodeResultSchema = z.nativeEnum(EnumRunCodeResult);
export type RunCodeResult = z.infer<typeof runCodeResultSchema>;

export const saveCodeInputSchema = z.object({
  questionId: z.string().min(1),
  code: z.string().min(1),
});

export const EnumSaveCodeResult = {
  CodeSaved: "codeRanSuccessfully",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

const saveCodeResultSchema = z.nativeEnum(EnumSaveCodeResult);
export type SaveCodeResult = z.infer<typeof saveCodeResultSchema>;

export const resetCodeInputSchema = z.object({
  questionId: z.string().min(1),
});

export const EnumResetCodeResult = {
  CodeReset: "codeReset",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const resetCodeResultSchema = z.nativeEnum(EnumResetCodeResult);
export type ResetCodeResult = z.infer<typeof resetCodeResultSchema>;
