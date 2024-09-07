import { db } from "@/server/db";
import { questions } from "@/server/db/schema";

type AddQuestionToDbProps = {
  questionId: string;
  assignmentId: string;
};

export async function addQuestionToDb({
  questionId,
  assignmentId,
}: AddQuestionToDbProps) {
  return db.insert(questions).values({
    id: questionId,
    assignmentId,
  });
}
