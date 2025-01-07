import { Question } from "@/components/question/Question";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

type PageProps = {
  params: {
    classroomId: string;
    assignmentId: string;
    questionId: string;
  };
};

export default async function QuestionPage({
  params: { classroomId, assignmentId, questionId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorized = await canUserAccessQuestion({
    questionId,
    assignmentId,
    classroomId,
    userId,
    accessType: EnumAccessType.Read,
  });

  if (!isAuthorized) {
    return <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Question,
    questionId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="grow">
        <Question questionId={questionId} />
      </main>
    </div>
  );
}
