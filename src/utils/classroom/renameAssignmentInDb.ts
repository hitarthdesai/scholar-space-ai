import { db } from "@/server/db";
import { assignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type renameAssignmentProps = {
  assignmentId: string;
  newName: string;
};

export async function renameAssignmentInDb({
  assignmentId,
  newName,
}: renameAssignmentProps): Promise<boolean> {
  const result = await db
    .update(assignments)
    .set({ name: newName })
    .where(eq(assignments.id, assignmentId));

  return result.rows.length > 0;
}
