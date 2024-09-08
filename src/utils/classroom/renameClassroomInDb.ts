import { db } from "@/server/db";
import { classrooms } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type renameClassroomProps = {
  classroomId: string;
  newName: string;
};

export async function renameClassroomInDb({
  classroomId,
  newName,
}: renameClassroomProps): Promise<boolean> {
  const result = await db
    .update(classrooms)
    .set({ name: newName })
    .where(eq(classrooms.id, classroomId));

  return result.rows.length > 0;
}
