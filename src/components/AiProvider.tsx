import { createAI } from "ai/rsc";

import { type Message } from "@/schemas/chatSchema";
import { continueConversation } from "@/actions/continueConversation";

type AIState = Message[];
type UIState = Message[];
type Actions = {
  continueConversation: typeof continueConversation;
};

const initialMessages: Message[] = [];

export const AI = createAI<AIState, UIState, Actions>({
  initialAIState: initialMessages,
  initialUIState: initialMessages,
  actions: {
    continueConversation,
  },
});

export type TypeAI = typeof AI;
