import { db } from "@/server/db";
import { assignmentAttempts } from "@/server/db/schema";

type SubmitAssignmentAttemptToDbProps = {
  assignmentId: string;
  userId: string;
};

export async function submitAssignmentAttemptToDb({
  assignmentId,
  userId,
}: SubmitAssignmentAttemptToDbProps) {
  return db.insert(assignmentAttempts).values({
    assignmentId,
    userId,
    submitted: new Date(),
  });
}
