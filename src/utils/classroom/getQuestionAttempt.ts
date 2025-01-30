import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { questionAttempts } from "@/server/db/schema";

type getQuestionAttemptProps = {
  questionId: string;
  userId: string;
};

export async function getQuestionAttempt({
  questionId,
  userId,
}: getQuestionAttemptProps) {
  return db
    .select()
    .from(questionAttempts)
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId)
      )
    );
}
