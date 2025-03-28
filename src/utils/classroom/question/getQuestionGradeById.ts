import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type GetQuestionGradeByIdProps = {
  id: string;
};

export const getQuestionGradeById = ({ id }: GetQuestionGradeByIdProps) => {
  return db
    .select({
      name: questions.name,
      type: questions.type,
      grade: questions.grade,
    })
    .from(questions)
    .where(eq(questions.id, id))
    .then((res) => res[0]);
};
