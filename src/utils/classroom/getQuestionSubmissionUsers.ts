import { db } from "@/server/db";
import { eq, and, isNotNull } from "drizzle-orm";
import { questionAttempts, users } from "@/server/db/schema";

type GetQuestionSubmissionUsersProps = {
  questionId: string;
};

export async function getQuestionSubmissionUsers({
  questionId,
}: GetQuestionSubmissionUsersProps) {
  // return db
  //   .select({
  //     username: users.name,
  //   })
  //   .from(questionAttempts)
  //   .innerJoin(users, eq(questionAttempts.userId, users.id))
  //   .where(
  //     and(
  //       eq(questionAttempts.questionId, questionId),
  //       isNotNull(questionAttempts.submitted)
  //     )
  //   );
}
