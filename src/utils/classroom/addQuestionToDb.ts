import { type QuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import { questions } from "@/server/db/schema";

type AddQuestionToDbProps = {
  questionId: string;
  name: string;
  assignmentId: string;
  type: QuestionType;
  grade: number;
};

export async function addQuestionToDb({
  questionId,
  name,
  assignmentId,
  type,
  grade,
}: AddQuestionToDbProps) {
  return db.insert(questions).values({
    id: questionId,
    name,
    assignmentId,
    type,
    grade,
  });
}
