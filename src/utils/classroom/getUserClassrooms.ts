import { type Classroom, classroomSchema } from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classrooms, classroomStudents } from "@/server/db/schema";
import { desc, eq, or } from "drizzle-orm";
import { z } from "zod";

type GetUserClassroomsProps = {
  userId: string;
};

export async function getUserClassrooms({
  userId,
}: GetUserClassroomsProps): Promise<Classroom[]> {
  const _classrooms = await db
    .select({ id: classrooms.id, name: classrooms.name })
    .from(classrooms)
    .leftJoin(
      classroomStudents,
      eq(classrooms.id, classroomStudents.classroomId)
    )
    .where(
      or(
        eq(classrooms.teacherId, userId),
        eq(classroomStudents.studentId, userId)
      )
    )
    .orderBy(desc(classrooms.created_at));

  console.log(_classrooms);

  return z.array(classroomSchema).parse(_classrooms);
}
