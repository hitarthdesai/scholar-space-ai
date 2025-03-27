import { QuestionSubmissions } from "@/components/assignment/QuestionSubmissions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

type PageProps = {
  params: {
    classroomId: string;
    assignmentId: string;
  };
};

export default async function SubmissionPage({
  params: { classroomId, assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorizedToViewAssignment = await canUserAccessAssignment({
    assignmentId,
    classroomId,
    userId,
    accessType: EnumAccessType.Read,
  });

  if (!isAuthorizedToViewAssignment) {
    <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Submission,
    assignmentId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="flex h-full grow flex-col">
        <QuestionSubmissions
          classroomId={classroomId}
          assignmentId={assignmentId}
        />
      </main>
    </div>
  );
}
