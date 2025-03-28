import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import {
  questionOptions,
  questions,
  questionSelectedOptions,
} from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and } from "drizzle-orm";

type GetSingleCorrectMcqByIdForGradingProps = {
  id: string;
  userId: string;
};

export const getSingleCorrectMcqByIdForGrading = ({
  id,
  userId,
}: GetSingleCorrectMcqByIdForGradingProps) => {
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
        eq(questions.type, EnumQuestionType.SingleCorrectMcq)
      )
    )
    .then((res) => {
      const ret: {
        name: string;
        options: { value: string; label: string; isCorrect: boolean }[];
        selectedOption: string;
        correctAnswer: string;
      } = {
        name: res[0].questionName,
        options: [],
        selectedOption: "",
        correctAnswer: "",
      };

      const options = res.reduce(
        (acc, { value, label, isSelected, correctAnswer }) => {
          acc.options.push({ value, label, isCorrect: correctAnswer });
          if (isSelected) {
            acc.selectedOption = value;
          }
          if (correctAnswer) {
            acc.correctAnswer = value;
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
      type: EnumQuestionType.SingleCorrectMcq,
      question: questionText ?? "",
      correctAnswer: question.correctAnswer,
    })
  );

  return promise;
};
