import { EnumConversationType, type MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import {
  conversationMessages,
  conversations,
  messages,
  userConversations,
  userQuestions,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type SaveMessageToDbInput = {
  /** if undefined, generate a new conversationId */
  conversationId?: string;
  message: string;
  by: MessageRole;
  userId: string;
  questionId?: string;
};

type SaveMessageToDbOutput = {
  conversationId: string;
  messageId: string;
};

export const saveMessageToDb = async ({
  message,
  by,
  conversationId: incomingConvId,
  userId,
  questionId,
}: SaveMessageToDbInput): Promise<SaveMessageToDbOutput> => {
  return db.transaction(async (tx) => {
    let conversationId;
    if (!!incomingConvId) {
      conversationId = incomingConvId;
    } else if (!!questionId) {
      const [{ convId }] = await tx
        .select({
          convId: userQuestions.conversationId,
        })
        .from(userQuestions)
        .where(
          and(
            eq(userQuestions.questionId, questionId),
            eq(userQuestions.userId, userId)
          )
        );

      conversationId = convId ?? undefined;
    }
    if (!conversationId) {
      const [{ id }] = await tx
        .insert(conversations)
        .values({
          type: !!questionId
            ? EnumConversationType.Question
            : EnumConversationType.Free,
        })
        .returning({ id: conversations.id });
      conversationId = id;

      if (!!questionId) {
        await tx
          .update(userQuestions)
          .set({ conversationId })
          .where(
            and(
              eq(userQuestions.questionId, questionId),
              eq(userQuestions.userId, userId)
            )
          );
      }

      await tx.insert(userConversations).values({ conversationId, userId });
    } else {
      const doesConversationBelongToUser =
        (
          await tx
            .select({ conversationId: userConversations.conversationId })
            .from(userConversations)
            .where(
              and(
                eq(userConversations.userId, userId),
                eq(userConversations.conversationId, conversationId)
              )
            )
        ).length > 0;

      if (!doesConversationBelongToUser) {
        throw new Error("User does not have access to this conversation");
      }
    }

    const [{ messageId }] = await tx
      .insert(messages)
      .values([{ message, by }])
      .returning({ messageId: messages.id });

    await tx.insert(conversationMessages).values({ conversationId, messageId });

    return { conversationId, messageId };
  });
};
