import { db } from "@/server/db";
import { classroomParticpants, users } from "@/server/db/schema";
import { classroomFiles, files } from "@/server/db/schema/file";
import { eq } from "drizzle-orm";

type ClassroomFilesProps = {
  classroomId: string;
};

export async function getClassroomFilesFromDb({
  classroomId,
}: ClassroomFilesProps) {
  return db
    .select({
      id: files.id,
      name: files.name,
      added: files.added,
    })
    .from(classroomFiles)
    .innerJoin(files, eq(files.id, classroomFiles.fileId))
    .where(eq(classroomFiles.classroomId, classroomId));
}
