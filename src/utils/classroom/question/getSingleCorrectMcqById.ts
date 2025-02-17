import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import { questionOptions, questions } from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and } from "drizzle-orm";
import { unmergeMcqOptionsAndCorrectness } from "./unmergeMcqOptionsAndCorrectness";

type GetCodeQuestionByIdProps = {
  id: string;
};

export const getSingleCorrectMcqById = ({ id }: GetCodeQuestionByIdProps) => {
  const questionPromise = db
    .select({
      questionName: questions.name,
      value: questionOptions.optionId,
      label: questionOptions.label,
      isCorrect: questionOptions.isCorrect,
    })
    .from(questions)
    .innerJoin(questionOptions, eq(questions.id, questionOptions.questionId))
    .where(
      and(
        eq(questions.id, id),
        eq(questions.type, EnumQuestionType.SingleCorrectMcq)
      )
    )
    .then((res) => {
      const options = res.map(({ value, label, isCorrect }) => ({
        value,
        label,
        isCorrect,
      }));

      const { options: unmergedOptions, correctOptions } =
        unmergeMcqOptionsAndCorrectness({ options });

      return {
        name: res[0].questionName,
        options: unmergedOptions,
        correctOption: correctOptions[0],
      };
    });

  const questionTextPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });

  const promise = Promise.all([questionPromise, questionTextPromise]).then(
    ([question, questionText]) => ({
      id,
      ...question,
      type: EnumQuestionType.SingleCorrectMcq,
      question: questionText ?? "",
    })
  );

  return promise;
};
