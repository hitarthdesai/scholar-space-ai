import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { questionAttempts } from "@/server/db/schema";

type getQuestionAttemptsProps = {
  questionId: string;
  userId: string;
};

export async function getQuestionAttempts({
  questionId,
  userId,
}: getQuestionAttemptsProps) {
  return db
    .select({
      userId: questionAttempts.userId,
      questionId: questionAttempts.questionId,
    })
    .from(questionAttempts)
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId)
      )
    );
}
