import { type AccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { classroomAssignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { canUserAccessClassroom } from "./canUserAccessClassroom";

type CanUserAccessAssignmentProps = {
  assignmentId: string;
  /** Ensure classroom associated to given assignmentId has this classroomId */
  classroomId?: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessAssignment({
  assignmentId,
  classroomId,
  userId,
  accessType,
}: CanUserAccessAssignmentProps): Promise<boolean> {
  const data = await db
    .select({
      classroomId: classroomAssignments.classroomId,
    })
    .from(classroomAssignments)
    .where(eq(classroomAssignments.assignmentId, assignmentId));

  const classrooms = z
    .array(z.object({ classroomId: z.string().min(1) }))
    .parse(data);

  if (classrooms.length === 0) return false;
  const _classroomId = classrooms[0].classroomId;

  if (classroomId && _classroomId !== classroomId) return false;

  const isAuthorized = await canUserAccessClassroom({
    classroomId: _classroomId,
    userId,
    accessType,
  });

  return isAuthorized;
}
