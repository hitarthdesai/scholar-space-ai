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
