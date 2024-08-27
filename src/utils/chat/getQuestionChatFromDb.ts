import { db } from "@/server/db";
import {
  conversationMessages,
  messages,
  userQuestions,
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
    .from(userQuestions)
    .innerJoin(
      conversationMessages,
      eq(userQuestions.conversationId, conversationMessages.conversationId)
    )
    .innerJoin(messages, eq(conversationMessages.messageId, messages.id))
    .where(
      and(
        eq(userQuestions.userId, userId),
        eq(userQuestions.questionId, questionId),
        not(isNull(userQuestions.conversationId))
      )
    );
}
