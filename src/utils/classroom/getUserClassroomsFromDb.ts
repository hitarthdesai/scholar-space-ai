import { db } from "@/server/db";
import { classrooms, classroomParticpants } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

type GetUserClassroomsFromDbProps = {
  userId: string;
};

export async function getUserClassroomsFromDb({
  userId,
}: GetUserClassroomsFromDbProps) {
  return db
    .select({
      id: classrooms.id,
      name: classrooms.name,
      role: classroomParticpants.role,
      status: classroomParticpants.status,
    })
    .from(classrooms)
    .innerJoin(
      classroomParticpants,
      eq(classrooms.id, classroomParticpants.classroomId)
    )
    .where(eq(classroomParticpants.userId, userId))
    .orderBy(desc(classrooms.created_at));
}
