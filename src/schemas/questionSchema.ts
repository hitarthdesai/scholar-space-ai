import { z } from "zod";
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

export const mcqOption = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export type McqOption = z.infer<typeof mcqOption>;

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

export const editCodeQuestionFormSchema = addCodeQuestionFormSchema
  .pick({
    type: true,
    name: true,
    question: true,
    starterCode: true,
  })
  .merge(
    z.object({
      id: z.string().min(1),
    })
  );

export type EditCodeQuestionForm = z.infer<typeof editCodeQuestionFormSchema>;

const unrefinedAddSingleCorrectMCQQuestionFormSchema = z.object({
  type: z.literal(EnumQuestionType.SingleCorrectMcq),
  assignmentId: z.string().min(1),
  name: z.string().min(QUESTION_NAME_MIN_LENGTH).max(QUESTION_NAME_MAX_LENGTH),
  question: z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH),
  options: z
    .array(mcqOption)
    .min(MCQ_OPTIONS_MIN_LENGTH)
    .max(MCQ_OPTIONS_MAX_LENGTH),
  correctOption: z.string().min(1),
});

export const addSingleCorrectMCQQuestionFormSchema =
  unrefinedAddSingleCorrectMCQQuestionFormSchema.refine(
    (data) => {
      return data.options.some((o) => o.value === data.correctOption);
    },
    {
      path: ["correctOption"],
      message: "Correct option must be among the list of options",
    }
  );

export const editSingleCorrectMcqFormSchema =
  unrefinedAddSingleCorrectMCQQuestionFormSchema
    .pick({
      type: true,
      name: true,
      question: true,
      options: true,
      correctOption: true,
    })
    .merge(
      z.object({
        id: z.string().min(1),
      })
    );

export type EditSingleCorrectMcqForm = z.infer<
  typeof editSingleCorrectMcqFormSchema
>;

export type AddSingleCorrectMCQQuestionForm = z.infer<
  typeof addSingleCorrectMCQQuestionFormSchema
>;

const unrefinedAddMultiCorrectMCQQuestionFormSchema = z.object({
  type: z.literal(EnumQuestionType.MultiCorrectMcq),
  assignmentId: z.string().min(1),
  name: z.string().min(QUESTION_NAME_MIN_LENGTH).max(QUESTION_NAME_MAX_LENGTH),
  question: z
    .string()
    .min(QUESTION_TEXT_MIN_LENGTH)
    .max(QUESTION_TEXT_MAX_LENGTH),
  options: z.array(mcqOption).min(1),
  correctOptions: z.array(z.string()).min(1),
});
export const addMultiCorrectMCQQuestionFormSchema =
  unrefinedAddMultiCorrectMCQQuestionFormSchema.refine(
    (data) => {
      return data.correctOptions.every((co) =>
        data.options.some((o) => o.value === co)
      );
    },
    {
      path: ["correctOptions"],
      message: "Correct option must be among the list of options",
    }
  );

export const editMultiCorrectMcqFormSchema =
  unrefinedAddMultiCorrectMCQQuestionFormSchema
    .pick({
      type: true,
      name: true,
      question: true,
      options: true,
      correctOptions: true,
    })
    .merge(
      z.object({
        id: z.string().min(1),
      })
    );

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

export const editQuestionFormSchema = z
  .union([
    editCodeQuestionFormSchema.partial().and(
      z.object({
        type: z.literal(EnumQuestionType.Code),
        id: z.string().min(1),
      })
    ),
    editSingleCorrectMcqFormSchema.partial().and(
      z.object({
        type: z.literal(EnumQuestionType.SingleCorrectMcq),
        id: z.string().min(1),
        options: z.array(mcqOption).min(1),
        correctOption: z.string().min(1),
      })
    ),
    editMultiCorrectMcqFormSchema.partial().and(
      z.object({
        type: z.literal(EnumQuestionType.MultiCorrectMcq),
        id: z.string().min(1),
        options: z.array(mcqOption).min(1),
        correctOptions: z.array(z.string()).min(1),
      })
    ),
  ])
  .refine(
    (data) => {
      if (data.type === EnumQuestionType.SingleCorrectMcq) {
        return data.options.some((o) => o.value === data.correctOption);
      }
      if (data.type === EnumQuestionType.MultiCorrectMcq) {
        return data.correctOptions.every((co) =>
          data.options.some((o) => o.value === co)
        );
      }
      return true;
    },
    {
      path: ["correctOption"],
      message: "Correct option must be among the list of options",
    }
  );

export type EditQuestionForm = z.infer<typeof editQuestionFormSchema>;

export const EnumEditQuestionResult = {
  QuestionEdited: "QuestionEdited",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

export const editQuestionResultSchema = z.nativeEnum(EnumEditQuestionResult);
export type EditQuestionResult = z.infer<typeof editQuestionResultSchema>;

export const editQuestionSheetPropsSchema = z.union([
  z.object({
    type: z.literal(EnumQuestionType.Code),
    editPromise: z.promise(editCodeQuestionFormSchema),
  }),
  z.object({
    type: z.literal(EnumQuestionType.SingleCorrectMcq),
    editPromise: z.promise(editSingleCorrectMcqFormSchema),
  }),
  z.object({
    type: z.literal(EnumQuestionType.MultiCorrectMcq),
    editPromise: z.promise(z.undefined()),
  }),
]);

export type EditQuestionSheetProps = z.infer<
  typeof editQuestionSheetPropsSchema
>;

export const editPromiseSchema = z.promise(
  z.union([
    editCodeQuestionFormSchema,
    editSingleCorrectMcqFormSchema,
    z.undefined(),
  ])
);

export type EditPromise = z.infer<typeof editPromiseSchema>;

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
