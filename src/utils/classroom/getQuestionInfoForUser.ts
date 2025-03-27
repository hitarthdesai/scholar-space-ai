import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { questionAttempts, assignmentAttempts } from "@/server/db/schema";

type GetQuestionStatusForUserProps = {
  assignmentId: string;
  questionId: string;
  userId: string;
};

export async function getQuestionInfoForUser({
  assignmentId,
  questionId,
  userId,
}: GetQuestionStatusForUserProps) {
  const data = await db
    .select({
      userId: questionAttempts.userId,
      questionId: questionAttempts.questionId,
      submitted: assignmentAttempts.submitted,
    })
    .from(questionAttempts)
    .innerJoin(
      assignmentAttempts,
      eq(assignmentAttempts.assignmentId, assignmentId)
    )
    .where(
      and(
        eq(questionAttempts.userId, userId),
        eq(questionAttempts.questionId, questionId)
      )
    );

  if (data.length === 0) {
    return undefined;
  }

  const detail = data[0];
  return {
    userId: detail.userId,
    questionId: detail.questionId,
    isAssignmentSubmitted: !!detail.submitted,
  };
}
