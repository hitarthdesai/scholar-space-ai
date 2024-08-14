import { db } from "@/server/db";
import { assignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type DeleteAssignmentFromDbProps = {
  assignmentId: string;
};

export async function deleteAssignmentFromDb({
  assignmentId,
}: DeleteAssignmentFromDbProps) {
  return db.delete(assignments).where(eq(assignments.id, assignmentId));
}
