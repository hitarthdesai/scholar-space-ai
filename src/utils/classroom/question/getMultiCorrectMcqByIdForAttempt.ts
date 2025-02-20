import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import {
  questionOptions,
  questions,
  questionSelectedOptions,
} from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and, or, isNull } from "drizzle-orm";

type GetMultiCorrectMcqByIdForAttemptProps = {
  id: string;
  userId: string;
};

export const getMultiCorrectMcqByIdForAttempt = ({
  id,
  userId,
}: GetMultiCorrectMcqByIdForAttemptProps) => {
  const questionPromise = db
    .select({
      questionName: questions.name,
      value: questionOptions.optionId,
      label: questionOptions.label,
      isSelected: questionSelectedOptions.optionId,
    })
    .from(questions)
    .innerJoin(questionOptions, eq(questions.id, questionOptions.questionId))
    .leftJoin(
      questionSelectedOptions,
      eq(questionOptions.optionId, questionSelectedOptions.optionId)
    )
    .where(
      and(
        eq(questions.id, id),
        eq(questions.type, EnumQuestionType.MultiCorrectMcq),
        or(
          isNull(questionSelectedOptions.userId),
          eq(questionSelectedOptions.userId, userId)
        )
      )
    )
    .then((res) => {
      const ret: {
        name: string;
        options: { value: string; label: string }[];
        selectedOptions: string[];
      } = {
        name: res[0].questionName,
        options: [],
        selectedOptions: [],
      };

      const options = res.reduce((acc, { value, label, isSelected }) => {
        acc.options.push({ value, label });
        if (isSelected) {
          acc.selectedOptions.push(value);
        }
        return acc;
      }, ret);

      return options;
    });

  const questionTextPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });

  const promise = Promise.all([questionPromise, questionTextPromise]).then(
    ([question, questionText]) => ({
      id,
      ...question,
      type: EnumQuestionType.MultiCorrectMcq,
      question: questionText ?? "",
    })
  );

  return promise;
};
