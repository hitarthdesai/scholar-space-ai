import {
  type ClassroomDetails,
  classroomDetailsSchema,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
  users,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetClassroomDetailsProps = {
  classroomId: string;
  userId: string;
};

export async function getClassroomDetails({
  classroomId,
  userId,
}: GetClassroomDetailsProps): Promise<ClassroomDetails | undefined> {
  const [_classroom] = await db
    .selectDistinct({
      id: classrooms.id,
      name: classrooms.name,
      students: {
        id: users.id,
        name: users.name,
      },
    })
    .from(classrooms)
    .leftJoin(
      classroomStudents,
      eq(classrooms.id, classroomStudents.classroomId)
    )
    .leftJoin(users, eq(classroomStudents.studentId, users.id))
    .where(
      and(eq(classrooms.id, classroomId), eq(classrooms.teacherId, userId))
    );

  const _assignments = await db
    .selectDistinct({
      id: assignments.id,
      name: assignments.name,
    })
    .from(assignments)
    .innerJoin(
      classroomAssignments,
      eq(assignments.id, classroomAssignments.assignmentId)
    )
    .where(eq(classroomAssignments.classroomId, classroomId));

  const { success, data: classroom } = classroomDetailsSchema.safeParse({
    ..._classroom,
    assignments: _assignments,
  });

  if (!success) {
    return undefined;
  }

  return classroom;
}
