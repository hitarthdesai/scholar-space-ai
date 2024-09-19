import { type AccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { classroomAssignments } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { canUserAccessClassroom } from "./canUserAccessClassroom";

type CanUserAccessAssignmentProps = {
  assignmentId: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessAssignment({
  assignmentId,
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
  const classroomId = classrooms[0].classroomId;

  const isAuthorized = await canUserAccessClassroom({
    classroomId,
    userId,
    accessType,
  });

  return isAuthorized;
}
