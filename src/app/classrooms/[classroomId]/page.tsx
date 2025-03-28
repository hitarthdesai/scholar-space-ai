import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";
import ClassroomDashboardGridNav from "@/components/classroom/ClassroomDashboardGridNav";
import { getUserRoleInClassroom } from "@/utils/classroom/getUserRoleInClassroom";

type PageProps = {
  params: {
    classroomId: string;
  };
};

export default async function ClassroomPage({
  params: { classroomId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorized = await canUserAccessClassroom({
    userId,
    classroomId,
    accessType: EnumAccessType.Read,
  });
  if (!isAuthorized) {
    return <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Classroom,
    classroomId,
  });
  const userRole = await getUserRoleInClassroom({ userId, classroomId });
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <ClassroomDashboardGridNav
        userRole={userRole}
        classroomId={classroomId}
      />
    </div>
  );
}
