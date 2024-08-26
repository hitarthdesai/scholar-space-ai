import { EnumConversationType, type MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import {
  conversationMessages,
  conversations,
  messages,
  userConversations,
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
  conversationId: convId,
  userId,
  questionId,
}: SaveMessageToDbInput): Promise<SaveMessageToDbOutput> => {
  return db.transaction(async (tx) => {
    let conversationId = "";
    const doesConversationExist = !!convId;
    if (!doesConversationExist) {
      const [{ id }] = await tx
        .insert(conversations)
        .values({
          type: !!questionId
            ? EnumConversationType.Question
            : EnumConversationType.Free,
          questionId,
        })
        .returning({ id: conversations.id });
      conversationId = id;

      await tx.insert(userConversations).values({ conversationId, userId });
    } else {
      conversationId = convId;
      // ensure this conversation is the same as the one in the userConversations table
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

      // ensure this conversation is attached to the same question
      const doesConversationBelongToQuestion =
        !!questionId &&
        (
          await tx
            .select({ questionId: conversations.questionId })
            .from(conversations)
            .where(
              and(
                eq(conversations.id, conversationId),
                eq(conversations.questionId, questionId)
              )
            )
        ).length > 0;

      if (!doesConversationBelongToQuestion) {
        throw new Error("Conversation does not belong to the question");
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
