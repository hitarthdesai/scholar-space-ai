import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type DeleteQuestionFromDbProps = {
  questionId: string;
};

export async function deleteQuestionFromDb({
  questionId,
}: DeleteQuestionFromDbProps) {
  return db.delete(questions).where(eq(questions.id, questionId));
}
