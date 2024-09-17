import { UsersTable } from "@/components/classroom/users/UsersTable";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { EnumPage } from "@/utils/constants/page";

type PageProps = {
  params: {
    id: string;
  };
};

const data = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "accepted" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", status: "pending" },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    status: "accepted",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    status: "pending",
  },
];

export default async function ClassroomInvitations({
  params: { id: classroomId },
}: PageProps) {
  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.ClassroomInvitations,
    classroomId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <UsersTable users={data} />
    </div>
  );
}
