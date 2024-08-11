import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";

type CreateClassroomProps = {
  name: string;
  teacherId: string;
};

export async function createClassroom({
  name,
  teacherId,
}: CreateClassroomProps) {
  return db.insert(classrooms).values({
    name,
    teacherId,
  });
}
