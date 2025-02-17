import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";

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

/**
 * Title and Description of the sheet shown when editing a question based on its type
 */
export const editQuestionSheetConfigByQuestionType: Record<
  QuestionType,
  {
    title: string;
    description: string;
  }
> = {
  [EnumQuestionType.Code]: {
    title: "Edit this Code Question",
    description:
      "You're now editing a code question. Change what you need to and then click done when you're finished.",
  },
  [EnumQuestionType.SingleCorrectMcq]: {
    title: "Edit this Single Correct MCQ",
    description:
      "You're now editing a single correct MCQ. Change what you need to and then click done when you're finished.",
  },
  [EnumQuestionType.MultiCorrectMcq]: {
    title: "Edit this Multi Correct MCQ",
    description:
      "You're now editing a multiple correct MCQ. Change what you need to and then click done when you're finished.",
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
