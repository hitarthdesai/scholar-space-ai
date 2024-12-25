import {
  FILE_NAME_MAX_LENGTH,
  FILE_NAME_MIN_LENGTH,
} from "@/utils/constants/file";
import { z } from "zod";
import { EnumFormMode } from "./formSchema";

export const file = z.object({
  id: z.string(),
  name: z.string(),
  added: z.date(),
});

export type File = z.infer<typeof file>;

export const addEditFileSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
    classroomId: z.string(),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
  }),
]);

export type AddEditFileSheetProps = z.infer<typeof addEditFileSheetPropsSchema>;

export const addFileFormSchema = z.object({
  classroomId: z.string(),
  file: z.any(),
  name: z.string().min(FILE_NAME_MIN_LENGTH).max(FILE_NAME_MAX_LENGTH),
});

export type AddFileForm = z.infer<typeof addFileFormSchema>;

export const EnumAddFileResult = {
  FileAdded: "fileAdded",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

const addFileResultSchema = z.nativeEnum(EnumAddFileResult);
export type AddFileResult = z.infer<typeof addFileResultSchema>;
