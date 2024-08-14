import { db } from "@/server/db";
import { questions } from "@/server/db/schema";

type AddQuestionToDbProps = {
  question: string;
  assignmentId: string;
};

export async function addQuestionToDb({
  question,
  assignmentId,
}: AddQuestionToDbProps) {
  return db.insert(questions).values({
    question,
    assignmentId,
  });
}
