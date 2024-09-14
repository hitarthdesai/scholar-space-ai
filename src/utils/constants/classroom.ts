import { EnumFormMode, type FormMode } from "@/schemas/formSchema";

/** Title of the sheet shown when dealing with classrooms */
export const classroomSheetTitle: Record<FormMode, string> = {
  [EnumFormMode.Add]: "Add classroom",
  [EnumFormMode.Edit]: "Edit classroom",
};

/** Description of the sheet shown when dealing with classrooms */
export const classroomSheetDescription: Record<FormMode, string> = {
  [EnumFormMode.Add]:
    "You're now creating a new classroom. Specify a name. Then, click add when you're done.",
  [EnumFormMode.Edit]:
    "You're now editing a classroom. Modify what you need to, then click save when you're done.",
};

/** Minimum length of the classroom's name */
export const CLASSROOM_NAME_MIN_LENGTH = 4;

/** Maximum length of the classroom's name */
export const CLASSROOM_NAME_MAX_LENGTH = 20;
