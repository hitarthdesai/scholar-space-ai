import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type GetAssignmentQuestionsFromDbProps = {
  assignmentId: string;
};

export async function getAssignmentQuestionsFromDb({
  assignmentId,
}: GetAssignmentQuestionsFromDbProps) {
  return db
    .select({
      id: questions.id,
      name: questions.name,
    })
    .from(questions)
    .where(eq(questions.assignmentId, assignmentId));
}
