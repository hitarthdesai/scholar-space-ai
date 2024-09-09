import { db } from "@/server/db";
import {
  conversationMessages,
  messages,
  questionAttempts,
} from "@/server/db/schema";
import { and, eq, isNull, not } from "drizzle-orm";

type GetQuestionChatFromDbProps = {
  questionId: string;
  userId: string;
};

export async function getQuestionChatFromDb({
  questionId,
  userId,
}: GetQuestionChatFromDbProps) {
  return db
    .select({
      id: messages.id,
      content: messages.message,
      role: messages.by,
    })
    .from(questionAttempts)
    .innerJoin(
      conversationMessages,
      eq(questionAttempts.conversationId, conversationMessages.conversationId)
    )
    .innerJoin(messages, eq(conversationMessages.messageId, messages.id))
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId),
        not(isNull(questionAttempts.conversationId))
      )
    );
}
