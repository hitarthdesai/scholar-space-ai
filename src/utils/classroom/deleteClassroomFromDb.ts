import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type DeleteClassroomFromDbProps = {
  classroomId: string;
};

export async function deleteClassroomFromDb({
  classroomId,
}: DeleteClassroomFromDbProps) {
  return db.delete(classrooms).where(and(eq(classrooms.id, classroomId)));
}
