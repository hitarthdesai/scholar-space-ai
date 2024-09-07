import { type AccessType } from "@/schemas/dbTableAccessSchema";
import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { canUserAccessAssignment } from "./canUserAccessAssignment";

type CanUserAccessQuestionProps = {
  questionId: string;
  userId: string;
  accessType: AccessType;
};

export async function canUserAccessQuestion({
  questionId,
  userId,
  accessType,
}: CanUserAccessQuestionProps) {
  const data = await db
    .select({
      assignmentId: questions.assignmentId,
    })
    .from(questions)
    .where(eq(questions.id, questionId));

  const assignmentId = z
    .array(z.object({ assignmentId: z.string().min(1) }))
    .parse(data)[0].assignmentId;

  const isAuthorized = await canUserAccessAssignment({
    assignmentId,
    userId,
    accessType,
  });

  return isAuthorized;
}
