import { EnumFormMode, type FormMode } from "@/schemas/formSchema";

/** Title of the sheet shown when dealing with classroom participants */
export const fileSheetTitle: Record<FormMode, string> = {
  [EnumFormMode.Add]: "Add file",
  [EnumFormMode.Edit]: "Edit file",
};

/** Description of the sheet shown when dealing with classroom participants */
export const fileSheetDescription: Record<FormMode, string> = {
  [EnumFormMode.Add]:
    "You're now adding a new file. Upload a file, specify a name and then, click add when you're done.",
  [EnumFormMode.Edit]:
    "You're now editing a an existing file. Modify what you need to, then click save when you're done.",
};

/** Minimum length of the classroom's name */
export const FILE_NAME_MIN_LENGTH = 4;

/** Maximum length of the classroom's name */
export const FILE_NAME_MAX_LENGTH = 20;
