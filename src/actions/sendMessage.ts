"use server";

import { type AI } from "@/components/AiProvider";
import { type Message } from "@/components/ChatMessages";
import { EnumMessageRole } from "@/schemas/chatSchema";
import { getMutableAIState } from "ai/rsc";

export const sendMessage = async (input: string): Promise<Message> => {
  const history = getMutableAIState<typeof AI>();

  history.update([
    ...history.get(),
    { role: EnumMessageRole.User, content: input },
  ]);

  const response: Message = {
    role: EnumMessageRole.Assistant,
    content: "T'fuck should I know what's that",
  };

  history.done([...history.get(), response]);

  return response;
};
