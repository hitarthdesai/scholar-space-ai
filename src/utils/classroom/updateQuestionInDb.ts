import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateQuestionInDbProps = {
  questionId: string;
  name: string;
};

export async function updateQuestionInDb({
  name,
  questionId,
}: UpdateQuestionInDbProps) {
  return db
    .update(questions)
    .set({
      name,
    })
    .where(eq(questions.id, questionId));
}
