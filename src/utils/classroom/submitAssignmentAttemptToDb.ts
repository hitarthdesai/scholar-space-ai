import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { assignmentAttempts } from "@/server/db/schema";

type SubmitAssignmentAttemptToDbProps = {
  assignmentId: string;
  userId: string;
};

export async function submitAssignmentAttemptToDb({
  assignmentId,
  userId,
}: SubmitAssignmentAttemptToDbProps) {
  return db
    .update(assignmentAttempts)
    .set({ submitted: new Date() })
    .where(
      and(
        eq(assignmentAttempts.userId, userId),
        eq(assignmentAttempts.assignmentId, assignmentId)
      )
    );
}
