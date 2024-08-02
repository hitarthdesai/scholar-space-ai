import { createAI } from "ai/rsc";

import { type Message } from "@/schemas/chatSchema";
import { sendMessage } from "@/actions/sendMessage";

type AIState = Message[];
type UIState = Message[];
type Actions = {
  sendMessage: typeof sendMessage;
};

const initialMessages: Message[] = [];

export const AI = createAI<AIState, UIState, Actions>({
  initialAIState: initialMessages,
  initialUIState: initialMessages,
  actions: {
    sendMessage,
  },
});

export type TypeAI = typeof AI;
