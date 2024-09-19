import { db } from "@/server/db";
import { classroomParticpants } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetClassroomRoleFromDbProps = {
  userId: string;
  classroomId: string;
};

export async function getClassroomRoleFromDb({
  userId,
  classroomId,
}: GetClassroomRoleFromDbProps) {
  const [{ role }] = await db
    .select({
      role: classroomParticpants.role,
    })
    .from(classroomParticpants)
    .where(
      and(
        eq(classroomParticpants.userId, userId),
        eq(classroomParticpants.classroomId, classroomId)
      )
    );

  return role;
}
