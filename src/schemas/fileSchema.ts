import {
  FILE_NAME_MAX_LENGTH,
  FILE_NAME_MIN_LENGTH,
} from "@/utils/constants/file";
import { z } from "zod";

export const addFileFormSchema = z.object({
  file: z.string(),
  name: z.string().min(FILE_NAME_MIN_LENGTH).max(FILE_NAME_MAX_LENGTH),
});

export type AddFileForm = z.infer<typeof addFileFormSchema>;

export const EnumAddFileResult = {
  FileAdded: "FileAdded",
  NotAuthorized: "notAuthorized",
  NotUploaded: "notUploaded",
  Error: "error",
} as const;

const addFileResultSchema = z.nativeEnum(EnumAddFileResult);
export type AddFileResult = z.infer<typeof addFileResultSchema>;
