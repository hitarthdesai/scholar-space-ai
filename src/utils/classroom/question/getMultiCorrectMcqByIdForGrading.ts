import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import {
  questionOptions,
  questions,
  questionSelectedOptions,
} from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and } from "drizzle-orm";

type GetMultiCorrectMcqByIdForGradingProps = {
  id: string;
  userId: string;
};

export const getMultiCorrectMcqByIdForGrading = ({
  id,
  userId,
}: GetMultiCorrectMcqByIdForGradingProps) => {
  const questionPromise = db
    .select({
      questionName: questions.name,
      value: questionOptions.optionId,
      label: questionOptions.label,
      isSelected: questionSelectedOptions.optionId,
      correctAnswer: questionOptions.isCorrect,
    })
    .from(questions)
    .innerJoin(questionOptions, eq(questions.id, questionOptions.questionId))
    .leftJoin(
      questionSelectedOptions,
      and(
        eq(questionOptions.optionId, questionSelectedOptions.optionId),
        eq(questionSelectedOptions.userId, userId)
      )
    )
    .where(
      and(
        eq(questions.id, id),
        eq(questions.type, EnumQuestionType.MultiCorrectMcq)
      )
    )
    .then((res) => {
      const ret: {
        name: string;
        options: { value: string; label: string; isCorrect: boolean }[];
        selectedOptions: string[];
        correctAnswers: string[];
      } = {
        name: res[0].questionName,
        options: [],
        selectedOptions: [],
        correctAnswers: [],
      };

      const options = res.reduce(
        (acc, { value, label, isSelected, correctAnswer }) => {
          acc.options.push({ value, label, isCorrect: correctAnswer });
          if (isSelected) {
            acc.selectedOptions.push(value);
          }
          if (correctAnswer) {
            acc.correctAnswers.push(value);
          }
          return acc;
        },
        ret
      );

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
      correctAnswers: question.correctAnswers,
    })
  );

  return promise;
};
