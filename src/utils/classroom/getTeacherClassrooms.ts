import { type Classroom, classroomSchema } from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

type GetTeacherClassroomsProps = {
  teacherId: string;
};

export async function getTeacherClassrooms({
  teacherId,
}: GetTeacherClassroomsProps): Promise<Classroom[]> {
  const _classrooms = await db
    .select({ id: classrooms, name: classrooms.name })
    .from(classrooms)
    .where(eq(classrooms.teacherId, teacherId))
    .orderBy(desc(classrooms.created_at));

  return z.array(classroomSchema).parse(_classrooms);
}
