import { type AccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { canUserAccessAssignment } from "./canUserAccessAssignment";

type CanUserAccessQuestionProps = {
  questionId: string;
  /** Ensure assignment associated to given questionId has this assignmentId */
  assignmentId?: string;
  /** Ensure classroom associated to given assignmentId has this classroomId */
  classroomId?: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessQuestion({
  questionId,
  assignmentId,
  classroomId,
  userId,
  accessType,
}: CanUserAccessQuestionProps) {
  const data = await db
    .select({
      assignmentId: questions.assignmentId,
    })
    .from(questions)
    .where(eq(questions.id, questionId));

  const assignments = z
    .array(z.object({ assignmentId: z.string().min(1) }))
    .parse(data);

  if (assignments.length === 0) return false;
  const _assignmentId = assignments[0].assignmentId;

  if (assignmentId && _assignmentId !== assignmentId) return false;

  const isAuthorized = await canUserAccessAssignment({
    assignmentId: _assignmentId,
    classroomId,
    userId,
    accessType,
  });

  return isAuthorized;
}
