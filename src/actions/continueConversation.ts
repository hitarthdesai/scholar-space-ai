/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use server";

import {
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
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/utils/constants/chat";
import { createSafeActionClient } from "next-safe-action";

type ContinueConversationOutput = {
  stream: StreamableValue;
  newConversationId: string;
};

const groq = createGroq({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const continueConversation = createSafeActionClient()
  .schema(continueConversationInputSchema)
  .action(async ({ parsedInput }): Promise<ContinueConversationOutput> => {
    {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User session does not exist");
      }

      if (parsedInput.type === EnumConversationType.Question) {
        // TODO: check if user belongs in classroom that has the assignment that has this question
        const canUserAttemptQuestion = true;
        if (!canUserAttemptQuestion) {
          throw new Error("User is not allowed to attempt this question");
        }
      }

      const { conversationId } = await saveMessageToDb({
        message: parsedInput.prompt,
        by: EnumMessageRole.User,
        userId,
        conversationId: parsedInput.conversationId,
        questionId:
          parsedInput.type === EnumConversationType.Question
            ? parsedInput.questionId
            : undefined,
      });

      let fullResponse = "";
      const stream = createStreamableValue("");
      const history = getMutableAIState();
      history.update([
        ...history.get(),
        { role: EnumMessageRole.User, content: parsedInput.prompt },
      ]);

      (async () => {
        const { textStream } = await streamText({
          model: groq("llama-3.1-70b-versatile"),
          messages: history.get(),
          system: SYSTEM_PROMPT,
        });

        for await (const text of textStream) {
          stream.update(text);
          fullResponse += text;
        }
        history.done([
          ...history.get(),
          { role: EnumMessageRole.Assistant, content: stream.value },
        ]);

        await saveMessageToDb({
          message: fullResponse,
          by: EnumMessageRole.Assistant,
          userId,
          conversationId,
        });
        stream.done();
      })();

      return { stream: stream.value, newConversationId: conversationId };
    }
  });
