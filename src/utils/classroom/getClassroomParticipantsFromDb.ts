import { db } from "@/server/db";
import { classroomParticpants, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type ClassroomParticpantsProps = {
  classroomId: string;
};

export async function getClassroomParticipantsFromDb({
  classroomId,
}: ClassroomParticpantsProps) {
  return db
    .select({
      id: classroomParticpants.userId,
      name: users.name,
      email: users.email,
      role: classroomParticpants.role,
      status: classroomParticpants.status,
    })
    .from(classroomParticpants)
    .innerJoin(users, eq(users.id, classroomParticpants.userId))
    .where(eq(classroomParticpants.classroomId, classroomId));
}
