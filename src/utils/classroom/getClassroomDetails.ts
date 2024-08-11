import { Classroom, classroomSchema } from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetClassroomDetailsProps = {
  classroomId: string;
  userId: string;
};

export async function getClassroomDetails({
  classroomId,
  userId,
}: GetClassroomDetailsProps): Promise<Classroom | undefined> {
  const [_classroom] = await db
    .selectDistinct({
      id: classrooms.id,
      name: classrooms.name,
    })
    .from(classrooms)
    .where(
      and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, userId))
    );

  const { success, data: classroom } = classroomSchema.safeParse(_classroom);
  if (!success) {
    return undefined;
  }

  return classroom;
}
