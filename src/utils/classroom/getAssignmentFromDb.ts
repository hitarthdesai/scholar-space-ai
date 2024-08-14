import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
} from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";

type GetAssignmentFromDbProps = {
  assignmentId: string;
  userId: string;
};

export async function getAssignmentFromDb({
  assignmentId,
  userId,
}: GetAssignmentFromDbProps) {
  return db
    .select({
      id: assignments.id,
      name: assignments.name,
      classroomId: classrooms.id,
      classroomName: classrooms.name,
    })
    .from(assignments)
    .innerJoin(
      classroomAssignments,
      eq(classroomAssignments.assignmentId, assignments.id)
    )
    .innerJoin(classrooms, eq(classrooms.id, classroomAssignments.classroomId))
    .leftJoin(
      classroomStudents,
      eq(classroomStudents.classroomId, classrooms.id)
    )
    .where(
      and(
        eq(assignments.id, assignmentId),
        or(
          eq(classrooms.teacherId, userId),
          eq(classroomStudents.studentId, userId)
        )
      )
    );
}
