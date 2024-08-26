"use server";

import {
  ContinueConversationInput,
  continueConversationInputSchema,
  EnumConversationType,
  EnumMessageRole,
} from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import { saveMessageToDb } from "@/utils/chat/saveMessageToDb";
import { createStreamableValue, type StreamableValue } from "ai/rsc";

type ContinueConversationOutput = {
  stream: StreamableValue;
  newConversationId: string;
};

export const continueConversation = async (
  _input: ContinueConversationInput
): Promise<ContinueConversationOutput> => {
  const input = continueConversationInputSchema.parse(_input);

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("User session does not exist");
  }

  if (input.type === EnumConversationType.Question) {
    // TODO: check if user belongs in classroom that has the assignment that has this question
    const canUserAttemptQuestion = true;
    if (!canUserAttemptQuestion) {
      throw new Error("User is not allowed to attempt this question");
    }
  }

  const { conversationId } = await saveMessageToDb({
    message: input.prompt,
    by: EnumMessageRole.User,
    userId,
    conversationId: input.conversationId,
    questionId:
      input.type === EnumConversationType.Question
        ? input.questionId
        : undefined,
  });

  const stream = createStreamableValue("");

  // This temporarily just streams the input back to the user, with some ms delay
  // TODO: Remove this when we start querying the actual model
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    for await (const char of input.prompt) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      stream.update(char);
    }

    stream.done();
    await saveMessageToDb({
      message: input.prompt,
      by: EnumMessageRole.Assistant,
      userId,
      conversationId,
    });
  })();

  return { stream: stream.value, newConversationId: conversationId };
};
