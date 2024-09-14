import { db } from "@/server/db";
import { assignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type EditAssignmentInDbProps = {
  assignmentId: string;
  newName: string;
};

export async function editAssignmentInDb({
  assignmentId,
  newName,
}: EditAssignmentInDbProps): Promise<boolean> {
  const result = await db
    .update(assignments)
    .set({ name: newName })
    .where(eq(assignments.id, assignmentId));

  return result.rows.length > 0;
}
