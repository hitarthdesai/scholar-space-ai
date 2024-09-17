import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { EnumPage } from "@/utils/constants/page";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ClassroomInvitations({
  params: { id: classroomId },
}: PageProps) {
  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.ClassroomInvitations,
    classroomId,
  });
  return (
    <div className="flex h-full w-full flex-col p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      Classroom Invitations
    </div>
  );
}
