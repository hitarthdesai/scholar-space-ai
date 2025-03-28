import { getObject } from "@/utils/storage/s3/getObject";
import { getQuestionGradeById } from "./getQuestionGradeById";

type GetCodeQuestionAttemptByIdProps = {
  questionId: string;
  userId: string;
};

export const getCodeQuestionAttemptById = async ({
  questionId,
  userId,
}: GetCodeQuestionAttemptByIdProps) => {
  const questionDetailsPromise = getQuestionGradeById({
    id: questionId,
  });
  const questionPromise = getObject({
    fileName: `questions/${questionId}/question.txt`,
  });
  const codePromise = getObject({
    fileName: `questionAttempts/${questionId}/${userId}/solution`,
  });

  const [{ name, type, grade }, question, attemptCode] = await Promise.all([
    questionDetailsPromise,
    questionPromise,
    codePromise,
  ]);

  return {
    name,
    type,
    grade,
    question,
    attemptCode,
  };
};
