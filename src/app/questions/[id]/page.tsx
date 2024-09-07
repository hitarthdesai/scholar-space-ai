import { Question } from "@/components/assignment/Question";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
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

  const isAuthorized = await canUserAccessQuestion({
    questionId,
    userId,
    accessType: EnumAccessType.Read,
  });

  if (!isAuthorized) {
    return <NotAuthorizedToViewPage />;
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-center p-4">
      <Question questionId={questionId} />
    </main>
  );
}
