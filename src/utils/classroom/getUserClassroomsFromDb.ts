import {
  type ClassroomParticipantStatus,
  type ClassroomRole,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classrooms, classroomParticpants } from "@/server/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

type GetUserClassroomsFromDbProps = {
  userId: string;
  query?: string;
  role?: ClassroomRole;
  status?: ClassroomParticipantStatus;
};

export async function getUserClassroomsFromDb({
  userId,
  query,
  role,
  status,
}: GetUserClassroomsFromDbProps) {
  const whereClauses = [eq(classroomParticpants.userId, userId)];
  if (!!query) {
    whereClauses.push(
      sql`LOWER(${classrooms.name}) LIKE LOWER(CONCAT('%', ${query}, '%'))`
    );
  }
  if (!!role) {
    whereClauses.push(eq(classroomParticpants.role, role));
  }
  if (!!status) {
    whereClauses.push(eq(classroomParticpants.status, status));
  }

  return db
    .select({
      id: classrooms.id,
      name: classrooms.name,
      role: classroomParticpants.role,
      status: classroomParticpants.status,
    })
    .from(classrooms)
    .innerJoin(
      classroomParticpants,
      eq(classrooms.id, classroomParticpants.classroomId)
    )
    .where(and(...whereClauses))
    .orderBy(desc(classrooms.created_at));
}
