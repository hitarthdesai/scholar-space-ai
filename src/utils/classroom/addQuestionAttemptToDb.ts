import { db } from "@/server/db";
import { questionAttempts } from "@/server/db/schema";

type addQuestionAttemptToDbProps = {
  questionId: string;
  userId: string;
};

export async function addQuestionAttemptToDb({
  questionId,
  userId,
}: addQuestionAttemptToDbProps) {
  return db.insert(questionAttempts).values({
    userId: userId,
    questionId: questionId,
    answer: "",
  });
}
