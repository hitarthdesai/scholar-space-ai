import { z } from "zod";
import { EnumFormMode } from "./formSchema";
import { Question } from "@/components/question/Question";

const QUESTION_NAME_MIN_LENGTH = 5;
const QUESTION_NAME_MAX_LENGTH = 50;
const QUESTION_TEXT_MIN_LENGTH = 10;
const QUESTION_TEXT_MAX_LENGTH = 500;
const STARTER_CODE_MIN_LENGTH = 10;
const STARTER_CODE_MAX_LENGTH = 500;

export const MCQ_OPTIONS_MIN_LENGTH = 2;
export const MCQ_OPTIONS_MAX_LENGTH = 5;

export const EnumQuestionType = {
  Code: "code",
  SingleCorrectMcq: "single",
  MultiCorrectMcq: "multi",
} as const;

const questionTypeSchema = z.nativeEnum(EnumQuestionType);
export type QuestionType = z.infer<typeof questionTypeSchema>;

export const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
});

export type Question = z.infer<typeof questionSchema>;

export const editFormDefaultValuesSchema = z.tuple([
  z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH)
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
    id: z.string().min(1),
    name: z
      .string()
      .min(QUESTION_NAME_MIN_LENGTH)
      .max(QUESTION_NAME_MAX_LENGTH),
    editPromise: z.promise(editFormDefaultValuesSchema),
  }),
]);

export type AddEditQuestionSheetProps = z.infer<
  typeof addEditQuestionSheetPropsSchema
>;

export const addCodeQuestionFormSchema = z.object({
  type: z.literal(EnumQuestionType.Code),
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

export type AddCodeQuestionForm = z.infer<typeof addCodeQuestionFormSchema>;

export const mcqOption = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export type McqOption = z.infer<typeof mcqOption>;

export const addSingleCorrectMCQQuestionFormSchema = z
  .object({
    type: z.literal(EnumQuestionType.SingleCorrectMcq),
    assignmentId: z.string().min(1),
    name: z
      .string()
      .min(QUESTION_NAME_MIN_LENGTH)
      .max(QUESTION_NAME_MAX_LENGTH),
    question: z
      .string()
      .min(QUESTION_TEXT_MIN_LENGTH)
      .max(QUESTION_TEXT_MAX_LENGTH),
    options: z
      .array(mcqOption)
      .min(MCQ_OPTIONS_MIN_LENGTH)
      .max(MCQ_OPTIONS_MAX_LENGTH),
    correctOption: z.string().min(1),
  })
  .refine(
    (data) => {
      return data.options.some((o) => o.value === data.correctOption);
    },
    {
      path: ["correctOption"],
      message: "Correct option must be among the list of options",
    }
  );

export type AddSingleCorrectMCQQuestionForm = z.infer<
  typeof addSingleCorrectMCQQuestionFormSchema
>;

export const addMultiCorrectMCQQuestionFormSchema = z.object({
  type: z.literal(EnumQuestionType.MultiCorrectMcq),
  assignmentId: z.string().min(1),
  name: z.string().min(QUESTION_NAME_MIN_LENGTH).max(QUESTION_NAME_MAX_LENGTH),
  question: z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH),
  options: z.array(mcqOption).min(1),
});

export type AddMultiCorrectMCQQuestionForm = z.infer<
  typeof addMultiCorrectMCQQuestionFormSchema
>;

export const addQuestionFormSchema = z.union([
  addCodeQuestionFormSchema,
  addSingleCorrectMCQQuestionFormSchema,
  addMultiCorrectMCQQuestionFormSchema,
]);

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
});

export const EnumRunCodeResult = {
  CodeRanSuccessfully: "codeRanSuccessfully",
  CodeRanWithErrors: "codeRanWithErrors",
  Error: "error",
  InsufficientCodeLength: "insufficientCodeLength",
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

export const submitCodeInputSchema = z.object({
  questionId: z.string().min(1),
  code: z.string().min(1),
});

export const EnumSubmitCodeResult = {
  CodeSubmitted: "codeRanSuccessfully",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const submitCodeResultSchema = z.nativeEnum(EnumSubmitCodeResult);
export type SubmitCodeResult = z.infer<typeof submitCodeResultSchema>;

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
