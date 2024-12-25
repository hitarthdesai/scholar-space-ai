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
    classroomId: z.string(),
    file: file,
  }),
]);

export type AddEditFileSheetProps = z.infer<typeof addEditFileSheetPropsSchema>;

export const addFileFormSchema = z.object({
  classroomId: z.string(),
  file: z.any(),
  name: z.string().min(FILE_NAME_MIN_LENGTH).max(FILE_NAME_MAX_LENGTH),
});

export type AddFileForm = z.infer<typeof addFileFormSchema>;

export const editFileFormSchema = z.object({
  newName: z.string(),
  fileId: z.string(),
});

export type EditFileForm = z.infer<typeof editFileFormSchema>;

export const deleteFileFormSchema = z.object({
  fileId: z.string(),
});

export type DeleteFileForm = z.infer<typeof deleteFileFormSchema>;

export const EnumAddFileResult = {
  FileAdded: "fileAdded",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

const addFileResultSchema = z.nativeEnum(EnumAddFileResult);
export type AddFileResult = z.infer<typeof addFileResultSchema>;

export const EnumEditFileResult = {
  FileEdited: "fileEdited",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const editFileResultSchema = z.nativeEnum(EnumEditFileResult);
export type EditFileResult = z.infer<typeof editFileResultSchema>;

export const EnumDeleteFileResult = {
  FileDeleted: "fileDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteFileResultSchema = z.nativeEnum(EnumDeleteFileResult);
export type DeleteFileResult = z.infer<typeof deleteFileResultSchema>;
