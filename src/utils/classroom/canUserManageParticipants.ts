import { EnumClassroomRole } from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants, classrooms } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type CanUserManageParticipantsProps = {
  classroomId: string;
  userId: string;
};

export async function canUserManageParticipants({
  classroomId,
  userId,
}: CanUserManageParticipantsProps) {
  const allowedUsers = await db
    .select()
    .from(classrooms)
    .innerJoin(
      classroomParticpants,
      eq(classrooms.id, classroomParticpants.classroomId)
    )
    .where(
      and(
        eq(classrooms.id, classroomId),
        eq(classroomParticpants.userId, userId),
        eq(classroomParticpants.role, EnumClassroomRole.Admin)
      )
    );

  return allowedUsers.length > 0;
}
