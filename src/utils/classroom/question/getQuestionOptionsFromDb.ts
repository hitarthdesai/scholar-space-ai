import { db } from "@/server/db";
import { questionOptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type GetQuestionOptionsFromDbProps = {
  questionId: string;
};

export async function getQuestionOptionsFromDb({
  questionId,
}: GetQuestionOptionsFromDbProps) {
  return db
    .select({
      value: questionOptions.optionId,
      label: questionOptions.label,
      isCorrect: questionOptions.isCorrect,
    })
    .from(questionOptions)
    .where(eq(questionOptions.questionId, questionId));
}
