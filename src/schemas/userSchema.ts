import { z } from "zod";

export const EnumRole = {
  Student: "student",
  Teacher: "teacher",
} as const;

const roleSchema = z.nativeEnum(EnumRole);

export type Role = z.infer<typeof roleSchema>;
