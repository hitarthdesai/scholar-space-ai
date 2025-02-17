import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateQuestionInDbProps = {
  id: string;
  name: string;
};

export async function updateQuestionInDb({
  id,
  name,
}: UpdateQuestionInDbProps) {
  return db
    .update(questions)
    .set({
      name,
    })
    .where(eq(questions.id, id));
}
