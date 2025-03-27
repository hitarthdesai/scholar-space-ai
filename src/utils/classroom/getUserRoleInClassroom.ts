import { db } from "@/server/db";
import { classroomParticpants } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetUserRoleInClassroomProps = {
  userId: string;
  classroomId: string;
};

export async function getUserRoleInClassroom({
  userId,
  classroomId,
}: GetUserRoleInClassroomProps) {
  const userClassroom = await db
    .select({
      role: classroomParticpants.role,
    })
    .from(classroomParticpants)
    .where(
      and(
        eq(classroomParticpants.classroomId, classroomId),
        eq(classroomParticpants.userId, userId)
      )
    );

  return userClassroom[0]?.role ?? undefined;
}
