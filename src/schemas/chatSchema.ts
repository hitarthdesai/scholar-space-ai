import { z } from "zod";

import {
  CHAT_PROMPT_INPUT_MAX_LENGTH,
  CHAT_PROMPT_INPUT_MIN_LENGTH,
  CONVERSATION_NAME_MAX_LENGTH,
  CONVERSATION_NAME_MIN_LENGTH,
} from "@/utils/constants/chat";
import { type continueConversation } from "@/actions/continueConversation";

export const promptSchema = z.object({
  prompt: z
    .string()
    .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
    .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
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

export const conversationSchema = z.object({
  id: z.string().min(1),
  createdAt: z.date(),
  name: z
    .string()
    .min(CONVERSATION_NAME_MIN_LENGTH)
    .max(CONVERSATION_NAME_MAX_LENGTH),
});

export type Conversation = z.infer<typeof conversationSchema>;

export const renameConversationFormSchema = z.object({
  conversationId: z.string().min(1),
  newName: z
    .string()
    .min(CONVERSATION_NAME_MIN_LENGTH)
    .max(CONVERSATION_NAME_MAX_LENGTH),
});

export type RenameConversationForm = z.infer<
  typeof renameConversationFormSchema
>;

export const EnumRenameConversationResult = {
  ConversationRenamed: "classroomCreated",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const renameConversationResultSchema = z.nativeEnum(
  EnumRenameConversationResult
);
export type RenameConversationResult = z.infer<
  typeof renameConversationResultSchema
>;

export const deleteConversationInputSchema = z.object({
  conversationId: z.string().min(1),
});

export type DeleteConversationInput = z.infer<
  typeof deleteConversationInputSchema
>;

export const EnumDeleteConversationResult = {
  ConversationDeleted: "conversationDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteConversationResultSchema = z.nativeEnum(
  EnumDeleteConversationResult
);
export type DeleteConversationResult = z.infer<
  typeof deleteConversationResultSchema
>;

export type AIState = Message[];
export type UIState = Message[];
export type Actions = {
  continueConversation: typeof continueConversation;
};
