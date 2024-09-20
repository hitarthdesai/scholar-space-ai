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
import { getObject } from "@/utils/storage/s3/getObject";
import { useCodeContext } from "@/contexts/CodeContext";

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
      let customSystemPrompt = "";
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

          const question =
            (await getObject({
              fileName: `questions/${parsedInput.questionId}/question.txt`,
            })) ?? "";

          const currentUserCode = await getObject({
            fileName: `questionAttempts/${parsedInput.questionId}/${userId}`,
          });

          const starterCode =
            (await getObject({
              fileName: `questions/${parsedInput.questionId}/starterCode.txt`,
            })) ?? "";

          customSystemPrompt = `You are an AI coding tutor assisting a student with a programming question. Your role is to guide and support the student's learning process without providing direct solutions. Use the following context to inform your responses:

          Question: ${question}
          Current User Code: ${currentUserCode || "The student has not written any code yet."}
          Starter Code: ${starterCode}

          Guidelines:
          1. Do not provide the final answer or complete solution to the question.
          2. Offer hints, explanations, and suggestions to help the student understand the problem and develop their own solution.
          3. If the student's code has errors, guide them to identify and fix the issues themselves.
          4. Encourage good coding practices and explain programming concepts when relevant.
          5. Be prepared to discuss general programming topics or engage in conversation related to the current code.
          6. If the student seems stuck, ask probing questions to help them think through the problem.
          7. Provide positive reinforcement for correct steps and good attempts.
          8. If the student asks about topics unrelated to programming, politely redirect the conversation back to the coding task at hand.

          Remember, your goal is to facilitate learning and problem-solving skills, not to solve the problem for the student.`;

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
          const { textStream } = await streamText({
            model: groq("llama-3.1-70b-versatile"),
            messages: history.get(),
            system:
              parsedInput.type === EnumConversationType.Question
                ? customSystemPrompt
                : SYSTEM_PROMPT,
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

      // Handle the promise
      streamPromise.catch((error) => {
        console.error("Unhandled error in streaming:", error);
      });

      return { stream: stream.value, newConversationId: conversationId };
    }
  });
