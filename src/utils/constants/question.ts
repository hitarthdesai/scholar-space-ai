import { EnumFormMode, type FormMode } from "@/schemas/formSchema";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";

/** @deprecated Title of the sheet shown when dealing with questions */
export const questionSheetTitle: Record<FormMode, string> = {
  [EnumFormMode.Add]: "Add Question",
  [EnumFormMode.Edit]: "Edit Question",
};

/** @deprecated Description of the sheet shown when dealing with questions */
export const questionSheetDescription: Record<FormMode, string> = {
  [EnumFormMode.Add]:
    "You're now creating a new question. Specify a name and your question's text. Then, click add when you're done.",
  [EnumFormMode.Edit]:
    "You're now editing a questions. Modify what you need to, then click save when you're done.",
};

/**
 * Title and Description of the sheet shown when adding a question based on its type
 */
export const addQuestionSheetConfigByQuestionType: Record<
  QuestionType,
  {
    title: string;
    description: string;
  }
> = {
  [EnumQuestionType.Code]: {
    title: "Add a Code Question",
    description:
      "You're now creating a new code question. Specify a name, question's text, starter code and then, click add when you're done.",
  },
  [EnumQuestionType.SingleCorrectMcq]: {
    title: "Add a Single Correct MCQ",
    description:
      "You're now creating a new single correct MCQ. Specify a name, question's text, its options and the one correct answer. Then, click add when you're done.",
  },
  [EnumQuestionType.MultiCorrectMcq]: {
    title: "Add a Multi Correct MCQ",
    description:
      "You're now creating a new multiple correct MCQ. Specify a name, question's text, its options and one or more correct answers. Then, click add when you're done.",
  },
};

export const EnumTabsContentType = {
  Chat: "Chat",
  // InputOutput: "InputOutput",
} as const;

type TabDetails = {
  label: string;
  value: string;
};

export const tabsDetails: Record<keyof typeof EnumTabsContentType, TabDetails> =
  {
    [EnumTabsContentType.Chat]: {
      label: "Chat",
      value: "chat",
    },
    // [EnumTabsContentType.InputOutput]: {
    //   label: "Input/Output",
    //   value: "input-output",
    // },
  };
