import { db } from "@/server/db";
import { assignments } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetAssignmentFromDbProps = {
  assignmentId: string;
};

export async function getAssignmentFromDb({
  assignmentId,
}: GetAssignmentFromDbProps) {
  return db
    .select({
      id: assignments.id,
      name: assignments.name,
    })
    .from(assignments)
    .where(and(eq(assignments.id, assignmentId)));
}
