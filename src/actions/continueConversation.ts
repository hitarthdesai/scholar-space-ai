"use server";

import { EnumMessageRole } from "@/schemas/chatSchema";
import { saveMessageToDb } from "@/utils/chat/saveMessageToDb";
import { createStreamableValue, type StreamableValue } from "ai/rsc";

type ContinueConversationInput = {
  prompt: string;
  conversationId?: string;
};

type ContinueConversationOutput = {
  stream: StreamableValue;
  newConversationId: string;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const continueConversation = async ({
  prompt,
  conversationId: _converationId,
}: ContinueConversationInput): Promise<ContinueConversationOutput> => {
  const { conversationId } = await saveMessageToDb({
    message: prompt,
    by: EnumMessageRole.User,
    conversationId: _converationId,
  });

  const stream = createStreamableValue("");

  // This temporarily just streams the input back to the user, with some ms delay
  // TODO: Remove this when we start querying the actual model
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    for await (const char of prompt) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      stream.update(char);
    }

    stream.done();
    await saveMessageToDb({
      message: prompt,
      by: EnumMessageRole.Assistant,
      conversationId,
    });
  })();

  return { stream: stream.value, newConversationId: conversationId };
};
