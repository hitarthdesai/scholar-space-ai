import { db } from "@/server/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { questionAttempts } from "@/server/db/schema";

type getQuestionSubmissionProps = {
  questionId: string;
  userId: string;
};

export async function getQuestionSubmission({
  questionId,
  userId,
}: getQuestionSubmissionProps) {
  return db
    .select({
      userId: questionAttempts.userId,
      questionId: questionAttempts.questionId,
      submissionId: questionAttempts.submitted,
    })
    .from(questionAttempts)
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId),
        isNotNull(questionAttempts.submitted)
      )
    );
}
