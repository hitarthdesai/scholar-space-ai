import { EnumQuestionType } from "@/schemas/questionSchema";
import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { getObject } from "@/utils/storage/s3/getObject";
import { eq, and } from "drizzle-orm";

type GetCodeQuestionByIdProps = {
  id: string;
};

export const getCodeQuestionById = ({ id }: GetCodeQuestionByIdProps) => {
  const questionPromise = db
    .select({
      name: questions.name,
      grade: questions.grade,
    })
    .from(questions)
    .where(and(eq(questions.id, id), eq(questions.type, EnumQuestionType.Code)))
    .then((res) => res[0]);

  const questionTextPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });

  const starterCodePromise = getObject({
    fileName: `questions/${id}/starterCode.txt`,
  });

  const promise = Promise.all([
    questionPromise,
    questionTextPromise,
    starterCodePromise,
  ]).then(([{ name, grade }, question, starterCode]) => ({
    id,
    name,
    grade,
    type: EnumQuestionType.Code,
    question: question ?? "",
    starterCode: starterCode ?? "",
  }));

  return promise;
};
