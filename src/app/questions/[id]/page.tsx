import { Question } from "@/components/assignment/Question";
import { auth } from "@/utils/auth/config";
import { getQuestionFromDb } from "@/utils/classroom/getQuestionFromDb";
import assert from "assert";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function QuestionPage({
  params: { id: questionId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const _questions = await getQuestionFromDb({ questionId, userId });
  const question = _questions[0];

  return (
    <main className="flex h-full w-full flex-col items-center justify-center p-4">
      <Question question={question} />
    </main>
  );
}
