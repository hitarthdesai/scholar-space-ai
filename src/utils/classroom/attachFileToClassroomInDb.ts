import { db } from "@/server/db";
import { classroomFiles } from "@/server/db/schema";

type AttachFileToClassroomInDbProps = {
  fileId: string;
  classroomId: string;
};

export async function attachFileToClassroomInDb({
  fileId,
  classroomId,
}: AttachFileToClassroomInDbProps) {
  return db.insert(classroomFiles).values({
    fileId,
    classroomId,
  });
}
