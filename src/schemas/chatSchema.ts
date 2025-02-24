import { z } from "zod";

import {
  CHAT_PROMPT_INPUT_MAX_LENGTH,
  CHAT_PROMPT_INPUT_MIN_LENGTH,
  CONVERSATION_NAME_MAX_LENGTH,
  CONVERSATION_NAME_MIN_LENGTH,
} from "@/utils/constants/chat";
import { type continueConversation } from "@/actions/continueConversation";

export const EnumConversationType = {
  Free: "free",
  Question: "ques",
  Classroom: "class",
} as const;

const conversationTypeSchema = z.nativeEnum(EnumConversationType);
export type ConversationType = z.infer<typeof conversationTypeSchema>;

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
  type: conversationTypeSchema,
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
  ConversationRenamed: "conversationRenamed",
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

export const continueConversationInputSchema = z.union([
  z.object({
    type: z.literal(EnumConversationType.Free),
    prompt: z
      .string()
      .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
      .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
    conversationId: z.string().optional(),
    selectedFiles: z.array(z.string()),
  }),
  z.object({
    type: z.literal(EnumConversationType.Question),
    prompt: z
      .string()
      .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
      .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
    questionId: z.string(),
    selectedFiles: z.array(z.string()),
  }),
  z.object({
    type: z.literal(EnumConversationType.Classroom),
    prompt: z
      .string()
      .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
      .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
    classroomId: z.string(),
    conversationId: z.string().optional(),
    selectedFiles: z.array(z.string()),
  }),
]);

export type ContinueConversationInput = z.infer<
  typeof continueConversationInputSchema
>;

export const getSystemPromptByConversationTypeInputSchema = z.union([
  z.object({
    type: z.literal(EnumConversationType.Free),
  }),
  z.object({
    type: z.literal(EnumConversationType.Question),
    userId: z.string(),
    questionId: z.string(),
  }),
  z.object({
    type: z.literal(EnumConversationType.Classroom),
  }),
]);

export type GetSystemPromptByConversationTypeInput = z.infer<
  typeof getSystemPromptByConversationTypeInputSchema
>;

export type AIState = Message[];
export type UIState = Message[];
export type Actions = {
  continueConversation: typeof continueConversation;
};
