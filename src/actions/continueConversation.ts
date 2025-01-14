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
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import {
  classroomConversations,
  conversations,
  questionAttempts,
  userConversations,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { getSystemPromptByConversationType } from "@/utils/chat/getSystemPromptByConversationType";
import { type GetSystemPromptByConversationTypeInput } from "@/schemas/chatSchema";

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
      console.log("continueConversation", parsedInput);
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
            const id = await db.transaction(async (tx) => {
              const [{ id }] = await tx
                .insert(conversations)
                .values({
                  type: parsedInput.type,
                })
                .returning({ id: conversations.id });

              await tx
                .insert(userConversations)
                .values({ conversationId: id, userId });

              return id;
            });
            saveMessageToDbArgs.conversationId = id;
          } else {
            saveMessageToDbArgs.conversationId = parsedInput.conversationId;
          }

          break;
        }

        case EnumConversationType.Question: {
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

          break;
        }

        case EnumConversationType.Classroom: {
          if (!parsedInput.conversationId) {
            const id = await db.transaction(async (tx) => {
              const [{ id }] = await tx
                .insert(conversations)
                .values({
                  type: parsedInput.type,
                })
                .returning({ id: conversations.id });

              await tx.insert(userConversations).values({
                userId,
                conversationId: id,
              });

              await tx.insert(classroomConversations).values({
                classroomId: parsedInput.classroomId,
                conversationId: id,
              });

              return id;
            });
            saveMessageToDbArgs.conversationId = id;
          } else {
            saveMessageToDbArgs.conversationId = parsedInput.conversationId;
          }

          break;
        }
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

      const streamPromise = (async () => {
        try {
          const getSystemPromptArgs: GetSystemPromptByConversationTypeInput =
            parsedInput.type === EnumConversationType.Question
              ? {
                  type: parsedInput.type,
                  questionId: parsedInput.questionId,
                  userId,
                }
              : parsedInput.type === EnumConversationType.Classroom
                ? { type: parsedInput.type }
                : { type: parsedInput.type };

          const { textStream } = await streamText({
            model: groq("llama-3.1-70b-versatile"),
            messages: history.get(),
            system:
              await getSystemPromptByConversationType(getSystemPromptArgs),
          });

          for await (const text of textStream) {
            stream.update(text);
            fullResponse += text;
          }

          history.update([
            ...history.get(),
            { role: EnumMessageRole.Assistant, content: fullResponse },
          ]);

          await saveMessageToDb({
            ...saveMessageToDbArgs,
            by: EnumMessageRole.Assistant,
            message: fullResponse,
          });
        } catch (error) {
          console.error("Error in streaming:", error);
          stream.error(error);
        } finally {
          stream.done();
        }
      })();

      streamPromise.catch((error) => {
        console.error("Unhandled error in streaming:", error);
      });

      return { stream: stream.value, newConversationId: conversationId };
    }
  });
