import { db } from "@/server/db";
import { assignments, classroomAssignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type GetClassroomAssignmentsProps = {
  classroomId: string;
};

/**
 * Gets all assignments for a particular classroom
 */
export function getClassroomAssignments({
  classroomId,
}: GetClassroomAssignmentsProps) {
  return db
    .select({
      id: assignments.id,
      name: assignments.name,
    })
    .from(assignments)
    .innerJoin(
      classroomAssignments,
      eq(assignments.id, classroomAssignments.assignmentId)
    )
    .where(eq(classroomAssignments.classroomId, classroomId));
}
