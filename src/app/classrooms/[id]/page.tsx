import { Classroom } from "@/components/classroom/Classroom";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { isUserParticipantOfClassroom } from "@/utils/classroom/isUserParticipantOfClassroom";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ClassroomPage({
  params: { id: classroomId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorized = await isUserParticipantOfClassroom({
    classroomId,
    userId,
  });
  if (!isAuthorized) {
    return <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.Classroom,
    classroomId,
  });

  return (
    <div className="p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <main className="flex h-full w-full flex-col">
        <Classroom id={classroomId} />
      </main>
    </div>
  );
}
