import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";

export default async function ClassroomLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ classroomId: string }>;
}>) {
  const { classroomId } = await params;

  return (
    <div className="flex h-full w-full justify-center pl-2 pr-4">
      <ClassroomSidebar classroomId={classroomId} />

      <div className="absolute left-0 top-0 z-10 h-full w-full pt-2.5 sm:relative sm:grow">
        {children}
      </div>
    </div>
  );
}
