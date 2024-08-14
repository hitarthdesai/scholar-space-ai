import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type DeleteClassroomFromDbProps = {
  classroomId: string;
  teacherId: string;
};

export async function deleteClassroomFromDb({
  classroomId,
  teacherId,
}: DeleteClassroomFromDbProps) {
  return db
    .delete(classrooms)
    .where(
      and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, teacherId))
    );
}
