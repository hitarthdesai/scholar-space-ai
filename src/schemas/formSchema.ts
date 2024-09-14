import { z } from "zod";

export const EnumFormMode = {
  Add: "add",
  Edit: "edit",
} as const;

const formModeSchema = z.nativeEnum(EnumFormMode);
export type FormMode = z.infer<typeof formModeSchema>;
