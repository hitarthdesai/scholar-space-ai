import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants, classrooms } from "@/server/db/schema";

type AddClassroomToDbProps = {
  name: string;
  adminId: string;
};

export async function addClassroomToDb({
  name,
  adminId,
}: AddClassroomToDbProps) {
  return db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(classrooms)
      .values({
        name,
      })
      .returning({ id: classrooms.id });

    await tx.insert(classroomParticpants).values({
      classroomId: id,
      userId: adminId,
      role: EnumClassroomRole.Admin,
      status: EnumClassroomParticpantStatus.Accepted,
    });
  });
}
