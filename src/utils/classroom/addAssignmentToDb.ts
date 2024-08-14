import { db } from "@/server/db";
import { assignments, classroomAssignments } from "@/server/db/schema";

type AddAssignmentToDbProps = {
  classroomId: string;
  name: string;
};

export async function AddAssignmentToDb({
  name,
  classroomId,
}: AddAssignmentToDbProps) {
  return db.transaction(async (tx) => {
    const [{ id }] = await tx
      .insert(assignments)
      .values([{ name }])
      .returning({ id: assignments.id });

    await tx.insert(classroomAssignments).values([
      {
        classroomId,
        assignmentId: id,
      },
    ]);
  });
}
