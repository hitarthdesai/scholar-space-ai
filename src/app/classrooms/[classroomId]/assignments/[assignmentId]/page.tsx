import { AssignmentQuestions } from "@/components/assignment/AssignmentQuestions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

type PageProps = {
  params: {
    classroomId: string;
    assignmentId: string;
  };
};

export default async function AssignmentPage({
  params: { classroomId, assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorizedToViewClassroom = await canUserAccessClassroom({
    userId,
    classroomId,
    accessType: EnumAccessType.Read,
  });

  if (!isAuthorizedToViewClassroom) {
    return <NotAuthorizedToViewPage />;
  }

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
    page: EnumPage.Assignment,
    assignmentId,
  });

  return (
    <div className="flex h-full w-full flex-col p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="flex h-full grow flex-col">
        <AssignmentQuestions
          classroomId={classroomId}
          assignmentId={assignmentId}
        />
      </main>
    </div>
  );
}
