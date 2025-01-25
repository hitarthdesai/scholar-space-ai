import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { questionAttempts } from "@/server/db/schema";

type submitQuestionAttemptToDbProps = {
  questionId: string;
  userId: string;
};

export async function submitQuestionAttemptToDb({
  questionId,
  userId,
}: submitQuestionAttemptToDbProps) {
  return db
    .update(questionAttempts)
    .set({ submitted: new Date() })
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId)
      )
    );
}
