"use server";

import {
  continueConversationInputSchema,
  EnumConversationType,
  EnumMessageRole,
} from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import {
  saveMessageToDb,
  type SaveMessageToDbInput,
} from "@/utils/chat/saveMessageToDb";
import {
  createStreamableValue,
  type StreamableValue,
  getMutableAIState,
} from "ai/rsc";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/utils/constants/chat";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import {
  conversations,
  questionAttempts,
  userConversations,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

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

      const saveMessageToDbArgs: SaveMessageToDbInput = {
        by: EnumMessageRole.User,
        message: parsedInput.prompt,
        conversationId: "",
      };

      switch (parsedInput.type) {
        case EnumConversationType.Free: {
          if (!parsedInput.conversationId) {
            const [{ id }] = await db
              .insert(conversations)
              .values({
                type: parsedInput.type,
              })
              .returning({ id: conversations.id });
            saveMessageToDbArgs.conversationId = id;
          } else {
            saveMessageToDbArgs.conversationId = parsedInput.conversationId;
          }

          break;
        }

        case EnumConversationType.Question:
          {
            const isAuthorized = await canUserAccessQuestion({
              accessType: EnumAccessType.Read,
              userId,
              questionId: parsedInput.questionId,
            });

            if (!isAuthorized) {
              throw new Error("User is not allowed to attempt this question");
            }

            await db.transaction(async (tx) => {
              const attempts = await tx
                .select()
                .from(questionAttempts)
                .where(
                  and(
                    eq(questionAttempts.questionId, parsedInput.questionId),
                    eq(questionAttempts.userId, userId)
                  )
                );

              const _conversationId = attempts.at(0)?.conversationId;
              if (!_conversationId) {
                const [{ id }] = await tx
                  .insert(conversations)
                  .values({
                    type: parsedInput.type,
                  })
                  .returning({ id: conversations.id });

                await tx
                  .insert(userConversations)
                  .values({ conversationId: id, userId });

                saveMessageToDbArgs.conversationId = id;
              } else {
                saveMessageToDbArgs.conversationId = _conversationId;
              }

              if (attempts.length === 0) {
                await tx.insert(questionAttempts).values([
                  {
                    userId,
                    questionId: parsedInput.questionId,
                    conversationId: saveMessageToDbArgs.conversationId,
                    answer: "",
                  },
                ]);
              }
            });
          }

          break;
      }

      const { conversationId } = await saveMessageToDb({
        ...saveMessageToDbArgs,
        by: EnumMessageRole.User,
      });

      let fullResponse = "";
      const stream = createStreamableValue("");
      const history = getMutableAIState();
      history.update([
        ...history.get(),
        { role: EnumMessageRole.User, content: parsedInput.prompt },
      ]);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
          ...saveMessageToDbArgs,
          by: EnumMessageRole.Assistant,
          message: fullResponse,
        });
        stream.done();
      })();

      return { stream: stream.value, newConversationId: conversationId };
    }
  });
