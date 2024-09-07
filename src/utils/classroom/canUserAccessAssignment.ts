import { type AccessType, EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
} from "@/server/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

type CanUserAccessAssignmentProps = {
  assignmentId: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessAssignment({
  assignmentId,
  userId,
  accessType,
}: CanUserAccessAssignmentProps): Promise<boolean> {
  const userAccessWhereClause =
    accessType === EnumAccessType.Write
      ? eq(classrooms.teacherId, userId)
      : or(
          eq(classrooms.teacherId, userId),
          eq(classroomStudents.studentId, userId)
        );

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
    .where(and(eq(assignments.id, assignmentId), userAccessWhereClause));

  return exists === 1;
}
