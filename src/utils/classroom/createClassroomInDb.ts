import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";

type CreateClassroomInDbProps = {
  name: string;
  teacherId: string;
};

export async function createClassroomInDb({
  name,
  teacherId,
}: CreateClassroomInDbProps) {
  const [{ classroomId }] = await db
    .insert(classrooms)
    .values({
      name,
      teacherId,
    })
    .returning({ classroomId: classrooms.id })
    .execute();

  return classroomId;
}
