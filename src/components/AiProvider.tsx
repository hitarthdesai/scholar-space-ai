import { createAI } from "ai/rsc";

import { type Message } from "@/schemas/chatSchema";
import { sendMessage } from "@/actions/sendMessage";

export type AIState = Message[];
export type UIState = Message[];

// TODO: Remove this once done with dev work
const initialMessages: Message[] = [
  { role: "assistant", content: "Hello! How can I help you today?" },
  { role: "user", content: "I need help with my studies." },
];

export const AI = createAI<AIState, UIState>({
  initialAIState: initialMessages,
  initialUIState: initialMessages,
  actions: {
    sendMessage,
  },
});
