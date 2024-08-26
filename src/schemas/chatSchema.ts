import { z } from "zod";

import {
  CHAT_PROMPT_INPUT_MAX_LENGTH,
  CHAT_PROMPT_INPUT_MIN_LENGTH,
} from "@/utils/constants/chat";
import { type continueConversation } from "@/actions/continueConversation";

export const EnumConversationType = {
  Free: "free",
  Question: "ques",
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
  questionId: z.string().nullable(),
});

export type Conversation = z.infer<typeof conversationSchema>;

export const continueConversationInputSchema = z.union([
  z.object({
    type: z.literal(EnumConversationType.Free),
    prompt: z
      .string()
      .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
      .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
    conversationId: z.string().optional(),
  }),
  z.object({
    type: z.literal(EnumConversationType.Question),
    prompt: z
      .string()
      .min(CHAT_PROMPT_INPUT_MIN_LENGTH)
      .max(CHAT_PROMPT_INPUT_MAX_LENGTH),
    conversationId: z.string().optional(),
    questionId: z.string().optional(),
  }),
]);

export type ContinueConversationInput = z.infer<
  typeof continueConversationInputSchema
>;

export type AIState = Message[];
export type UIState = Message[];
export type Actions = {
  continueConversation: typeof continueConversation;
};
