import { z } from "zod";

export const promptSchema = z.object({
  prompt: z.string().min(5),
});

export type PromptInput = z.infer<typeof promptSchema>;

export const EnumMessageRole = {
  User: "user",
  Assistant: "assistant",
} as const;

const messageRoleSchema = z.nativeEnum(EnumMessageRole);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export const messageSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1),
});

export type Message = z.infer<typeof messageSchema>;
