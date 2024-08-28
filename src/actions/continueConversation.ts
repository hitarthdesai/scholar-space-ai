"use server";

import {
  type ContinueConversationInput,
  continueConversationInputSchema,
  EnumConversationType,
  EnumMessageRole,
} from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import { saveMessageToDb } from "@/utils/chat/saveMessageToDb";
import {
  createStreamableValue,
  type StreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { generateText } from "ai";
import { SYSTEM_PROMPT } from "@/utils/constants/chat";

type ContinueConversationOutput = {
  stream: StreamableValue;
  newConversationId: string;
};

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

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

  const history = getMutableAIState();
  history.update([
    ...history.get(),
    { role: EnumMessageRole.User, content: input.prompt },
  ]);

  const response = await generateText({
    model: groq("llama-3.1-70b-versatile"),
    messages: history.get(),
    system: SYSTEM_PROMPT,
  });

  history.done([
    ...history.get(),
    { role: EnumMessageRole.Assistant, content: response },
  ]);

  const stream = createStreamableValue("");

  // This temporarily just streams the input back to the user, with some ms delay
  // TODO: Remove this when we start querying the actual model
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  (async () => {
    for await (const char of response.text) {
      stream.update(char);
    }

    stream.done();
    await saveMessageToDb({
      message: response.text,
      by: EnumMessageRole.Assistant,
      userId,
      conversationId,
    });
  })();

  return { stream: stream.value, newConversationId: conversationId };
};
