import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
} from "@/server/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

type CanUserViewAssignmentProps = {
  assignmentId: string;
  userId: string;
};

export async function canUserViewAssignment({
  assignmentId,
  userId,
}: CanUserViewAssignmentProps): Promise<boolean> {
  const [{ exists }] = await db
    .select({
      exists: sql<number>`1`,
    })
    .from(assignments)
    .leftJoin(
      classroomAssignments,
      eq(assignments.id, classroomAssignments.assignmentId)
    )
    .leftJoin(
      classroomStudents,
      eq(classroomStudents.classroomId, classroomAssignments.classroomId)
    )
    .leftJoin(classrooms, eq(classrooms.id, classroomAssignments.classroomId))
    .where(
      and(
        eq(assignments.id, assignmentId),
        or(
          eq(classrooms.teacherId, userId),
          eq(classroomStudents.studentId, userId)
        )
      )
    );

  return exists === 1;
}
