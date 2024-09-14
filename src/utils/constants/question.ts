import {
  EnumQuestionFormMode,
  type QuestionFormMode,
} from "@/schemas/questionSchema";

/** Title of the sheet shown when dealing with questions */
export const questionSheetTitle: Record<QuestionFormMode, string> = {
  [EnumQuestionFormMode.Add]: "Add Question",
  [EnumQuestionFormMode.Edit]: "Edit Question",
};

/** Description of the sheet shown when dealing with questions */
export const questionSheetDescription: Record<QuestionFormMode, string> = {
  [EnumQuestionFormMode.Add]:
    "You're now creating a new question. Specify a name and your question's text. Then, click add when you're done.",
  [EnumQuestionFormMode.Edit]:
    "You're now editing a questions. Modify what you need to, then click save when you're done.",
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
