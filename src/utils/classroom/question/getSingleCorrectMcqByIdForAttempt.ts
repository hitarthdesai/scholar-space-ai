import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import {
  questionOptions,
  questions,
  questionSelectedOptions,
} from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and, or, isNull } from "drizzle-orm";

type GetSingleCorrectMcqByIdForAttemptProps = {
  id: string;
  userId: string;
};

export const getSingleCorrectMcqByIdForAttempt = ({
  id,
  userId,
}: GetSingleCorrectMcqByIdForAttemptProps) => {
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
        eq(questions.type, EnumQuestionType.SingleCorrectMcq),
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
        selectedOption: string;
      } = {
        name: res[0].questionName,
        options: [],
        selectedOption: "",
      };

      const options = res.reduce((acc, { value, label, isSelected }) => {
        acc.options.push({ value, label });
        if (isSelected) {
          acc.selectedOption = value;
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
      type: EnumQuestionType.SingleCorrectMcq,
      question: questionText ?? "",
    })
  );

  return promise;
};
