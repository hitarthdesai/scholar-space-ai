import { createAI } from "ai/rsc";

import {
  type Actions,
  type AIState,
  type UIState,
  type Message,
} from "@/schemas/chatSchema";
import { continueConversation } from "@/actions/continueConversation";

export const AI = createAI<AIState, UIState, Actions>({
  actions: {
    continueConversation,
  },
});

export type TypeAI = typeof AI;
