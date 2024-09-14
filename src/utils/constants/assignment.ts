import { EnumFormMode, type FormMode } from "@/schemas/formSchema";

/** Title of the sheet shown when dealing with assignments */
export const assignmentSheetTitle: Record<FormMode, string> = {
  [EnumFormMode.Add]: "Add Assignment",
  [EnumFormMode.Edit]: "Edit Assignment",
};

/** Description of the sheet shown when dealing with assignments */
export const assignmentSheetDescription: Record<FormMode, string> = {
  [EnumFormMode.Add]:
    "You're now creating a new assignment. Specify a name. Then, click add when you're done.",
  [EnumFormMode.Edit]:
    "You're now editing an assignment. Modify what you need to, then click save when you're done.",
};

/** Minimum length of the assignment's name */
export const ASSIGNMENT_NAME_MIN_LENGTH = 4;

/** Maximum length of the assignment's name */
export const ASSIGNMENT_NAME_MAX_LENGTH = 20;
