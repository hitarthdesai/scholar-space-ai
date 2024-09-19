import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";
import { type AccessType, EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { classroomParticpants, classrooms } from "@/server/db/schema";
import { and, eq, or, sql } from "drizzle-orm";

type CanUserAccessClassroomProps = {
  classroomId: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessClassroom({
  classroomId,
  userId,
  accessType,
}: CanUserAccessClassroomProps): Promise<boolean> {
  const whereClauses = [
    eq(classroomParticpants.role, EnumClassroomRole.Admin),
    eq(classroomParticpants.role, EnumClassroomRole.Teacher),
  ];

  if (accessType === EnumAccessType.Read) {
    whereClauses.push(eq(classroomParticpants.role, EnumClassroomRole.Student));
    whereClauses.push(
      eq(classroomParticpants.role, EnumClassroomRole.TeachingAssistant)
    );
  }

  const whereClause = and(
    eq(classrooms.id, classroomId),
    eq(classroomParticpants.userId, userId),
    eq(classroomParticpants.status, EnumClassroomParticpantStatus.Accepted),
    or(...whereClauses)
  );

  const results = await db
    .select({
      exists: sql<number>`1`,
    })
    .from(classrooms)
    .innerJoin(
      classroomParticpants,
      eq(classroomParticpants.classroomId, classrooms.id)
    )
    .where(whereClause);

  if (results.length === 0) return false;
  return results[0].exists === 1;
}
