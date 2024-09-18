import { z } from "zod";

export const EnumAccessType = {
  Read: "read",
  Write: "write",
} as const;

const accessTypeSchema = z.nativeEnum(EnumAccessType);

export type AccessType = z.infer<typeof accessTypeSchema>;
