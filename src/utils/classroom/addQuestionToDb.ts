import { db } from "@/server/db";
import { questions } from "@/server/db/schema";

type AddQuestionToDbProps = {
  questionId: string;
  name: string;
  assignmentId: string;
};

export async function addQuestionToDb({
  questionId,
  name,
  assignmentId,
}: AddQuestionToDbProps) {
  return db.insert(questions).values({
    id: questionId,
    name,
    assignmentId,
  });
}
