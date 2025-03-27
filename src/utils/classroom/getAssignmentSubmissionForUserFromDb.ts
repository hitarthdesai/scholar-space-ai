import { db } from "@/server/db";
import { assignmentAttempts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetAssignmentSubmissionForUserFromDbProps = {
  assignmentId: string;
  userId: string;
};

export async function getAssignmentSubmissionForUserFromDb({
  assignmentId,
  userId,
}: GetAssignmentSubmissionForUserFromDbProps) {
  const attempt = await db
    .select({
      submitted: assignmentAttempts.submitted,
    })
    .from(assignmentAttempts)
    .where(
      and(
        eq(assignmentAttempts.assignmentId, assignmentId),
        eq(assignmentAttempts.userId, userId)
      )
    );

  if (attempt.length === 0) {
    return undefined;
  } else {
    return attempt[0].submitted ?? undefined;
  }
}
