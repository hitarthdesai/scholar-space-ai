import { type AccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { classroomFiles } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { canUserAccessClassroom } from "./canUserAccessClassroom";

type CanUserAccessFileProps = {
  fileId: string;
  /** Ensure classroom associated to given fileId has this classroomId */
  classroomId?: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessFile({
  fileId,
  classroomId,
  userId,
  accessType,
}: CanUserAccessFileProps): Promise<boolean> {
  const data = await db
    .select({
      classroomId: classroomFiles.classroomId,
    })
    .from(classroomFiles)
    .where(eq(classroomFiles.fileId, fileId));

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
