import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

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

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] grid-rows-2 gap-4 p-4">
      <div className="col-span-1 row-span-2">
        <ClassroomSidebar classroomId={classroomId} />
      </div>
      <div className="row-span-2 flex h-full w-full grow flex-col">
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />
        <main className="flex h-full w-full grow flex-col items-center justify-center">
          Classroom Home Page
        </main>
      </div>
    </div>
  );
}
