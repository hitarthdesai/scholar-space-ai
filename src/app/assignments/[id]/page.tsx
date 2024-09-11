import { AssignmentQuestions } from "@/components/assignment/AssignmentQuestions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { getAssignmentFromDb } from "@/utils/classroom/getAssignmentFromDb";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AssignmentPage({
  params: { id: assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorized = await canUserAccessAssignment({
    assignmentId,
    userId,
    accessType: EnumAccessType.Read,
  });
  if (!isAuthorized) {
    <NotAuthorizedToViewPage />;
  }

  const [assignment] = await getAssignmentFromDb({
    assignmentId,
  });

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Assignment,
    assignmentId,
  });

  return (
    <div className="p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="flex h-full flex-col items-center">
        <div className="w-full text-left font-semibold">
          Assignment Name: {assignment.name}
        </div>
        <div className="h-full w-full grow">
          <AssignmentQuestions assignmentId={assignmentId} />
        </div>
      </main>
    </div>
  );
}
