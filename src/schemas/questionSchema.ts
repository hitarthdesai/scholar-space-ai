import { z } from "zod";

export const questionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
});

export type Question = z.infer<typeof questionSchema>;

export const EnumQuestionFormMode = {
  Add: "add",
  Edit: "edit",
} as const;

const questionFormModeSchema = z.nativeEnum(EnumQuestionFormMode);
export type QuestionFormMode = z.infer<typeof questionFormModeSchema>;

export const editFormDefaultValuesSchema = z.tuple([
  z.object({
    name: z.string().min(1),
    id: z.string().min(1),
  }),
  z.string().min(1).optional(),
]);

export type EditFormDefaultValues = z.infer<typeof editFormDefaultValuesSchema>;

export const addEditQuestionSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumQuestionFormMode.Add),
    assignmentId: z.string().min(1),
  }),
  z.object({
    mode: z.literal(EnumQuestionFormMode.Edit),
    editPromise: z.promise(editFormDefaultValuesSchema),
  }),
]);

export type AddEditQuestionSheetProps = z.infer<
  typeof addEditQuestionSheetPropsSchema
>;

const QUESTION_NAME_MIN_LENGTH = 5;
const QUESTION_NAME_MAX_LENGTH = 50;
export const addQuestionFormSchema = z.object({
  assignmentId: z.string().min(1),
  name: z.string().min(QUESTION_NAME_MIN_LENGTH).max(QUESTION_NAME_MAX_LENGTH),
  question: z.string().min(1),
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
  question: z.string().min(1).optional(),
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
