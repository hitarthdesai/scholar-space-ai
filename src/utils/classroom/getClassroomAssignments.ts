import { db } from "@/server/db";
import {
  assignmentAttempts,
  assignments,
  classroomAssignments,
} from "@/server/db/schema";
import { and, count, eq, isNotNull } from "drizzle-orm";

type GetClassroomAssignmentsProps = {
  classroomId: string;
};

/**
 * Gets all assignments for a particular classroom
 */
export async function getClassroomAssignments({
  classroomId,
}: GetClassroomAssignmentsProps) {
  return db
    .select({
      id: assignments.id,
      name: assignments.name,
      submissionCount: count(assignmentAttempts.userId),
    })
    .from(assignments)
    .innerJoin(
      classroomAssignments,
      eq(assignments.id, classroomAssignments.assignmentId)
    )
    .leftJoin(
      assignmentAttempts,
      and(
        eq(assignments.id, assignmentAttempts.assignmentId),
        isNotNull(assignmentAttempts.submitted)
      )
    )
    .where(eq(classroomAssignments.classroomId, classroomId))
    .groupBy(assignments.id);
}
