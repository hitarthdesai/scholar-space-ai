import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";

type AddClassroomToDbProps = {
  name: string;
  teacherId: string;
};

export async function addClassroomToDb({
  name,
  teacherId,
}: AddClassroomToDbProps) {
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
