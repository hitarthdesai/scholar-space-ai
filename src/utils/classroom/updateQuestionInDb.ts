import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateQuestionInDbProps = {
  id: string;
  name?: string;
  grade?: number;
};

export async function updateQuestionInDb({
  id,
  name,
  grade,
}: UpdateQuestionInDbProps) {
  return db
    .update(questions)
    .set({
      name,
      grade,
    })
    .where(eq(questions.id, id));
}
