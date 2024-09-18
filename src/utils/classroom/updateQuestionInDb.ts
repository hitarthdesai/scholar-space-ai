import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateQuestionToDbProps = {
  questionId: string;
  name: string;
};

export async function updateQuestionToDb({
  name,
  questionId,
}: UpdateQuestionToDbProps) {
  return db
    .update(questions)
    .set({
      name,
    })
    .where(eq(questions.id, questionId));
}
