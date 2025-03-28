import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import {
  questionOptions,
  questions,
  questionSelectedOptions,
} from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and } from "drizzle-orm";

type GetSingleCorrectMcqByIdForAttemptProps = {
  id: string;
  userId: string;
};

export const getSingleCorrectMcqByIdForAttempt = ({
  id,
  userId,
}: GetSingleCorrectMcqByIdForAttemptProps) => {
  const questionOptionsPromise = db
    .select({
      value: questionOptions.optionId,
      label: questionOptions.label,
    })
    .from(questionOptions)
    .where(eq(questionOptions.questionId, id));

  const questionSelectedOptionsPromise = db
    .select({
      value: questionSelectedOptions.optionId,
    })
    .from(questionSelectedOptions)
    .where(
      and(
        eq(questionSelectedOptions.questionId, id),
        eq(questionSelectedOptions.userId, userId)
      )
    );

  const questionNamePromise = db
    .select({
      name: questions.name,
    })
    .from(questions)
    .where(eq(questions.id, id));

  const questionTextPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });

  const promise = Promise.all([
    questionOptionsPromise,
    questionSelectedOptionsPromise,
    questionNamePromise,
    questionTextPromise,
  ]).then(([options, selectedOptions, questionName, questionText]) => {
    return {
      id,
      type: EnumQuestionType.SingleCorrectMcq,
      name: questionName[0].name,
      questionText,
      options: options.map((option) => ({
        value: option.value,
        label: option.label,
      })),
      selectedOption: selectedOptions.map((option) => option.value)[0] ?? "",
    };
  });

  return promise;
};
