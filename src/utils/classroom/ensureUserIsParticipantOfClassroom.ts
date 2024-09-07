import { db } from "@/server/db";
import { classrooms, classroomStudents } from "@/server/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

type EnsureUserIsParticipantOfClassroomProps = {
  classroomId: string;
  userId: string;
};

export async function ensureUserIsParticipantOfClassroom({
  classroomId,
  userId,
}: EnsureUserIsParticipantOfClassroomProps): Promise<boolean> {
  const [{ exists }] = await db
    .select({
      exists: sql<number>`1`,
    })
    .from(classrooms)
    .leftJoin(
      classroomStudents,
      eq(classrooms.id, classroomStudents.classroomId)
    )
    .where(
      and(
        eq(classrooms.id, classroomId),
        or(
          eq(classrooms.teacherId, userId),
          eq(classroomStudents.studentId, userId)
        )
      )
    );

  return exists === 1;
}
