import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import {
  getBreadcrumbsByPage,
  GetBreadcrumbsByPageProps,
} from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { EnumPage, type Page } from "@/utils/constants/page";
import { headers } from "next/headers";

type DynamicRouteParams = {
  classroomId: string;
  assignmentId: string;
  questionId: string;
};

const getBreadcrumbPropsByDynamicRouteParams = (
  params: DynamicRouteParams
): GetBreadcrumbsByPageProps => {
  if (params.questionId && params.assignmentId) {
    return { page: EnumPage.Question, ...params };
  }

  if (params.assignmentId) {
    return { page: EnumPage.Assignment, ...params };
  }

  const header = headers();
  console.log(header.get("x-url"));

  return { page: EnumPage.Classroom, ...params };
};

export default async function ClassroomLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<DynamicRouteParams>;
}>) {
  const dynamicParams = await params;
  const props = getBreadcrumbPropsByDynamicRouteParams(dynamicParams);
  const breadcrumbs = await getBreadcrumbsByPage(props);

  return (
    <div className="flex h-full w-full justify-center pl-2 pr-4">
      <ClassroomSidebar classroomId={dynamicParams.classroomId} />
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />

      <div className="absolute left-0 top-0 z-10 h-full w-full pt-2.5 sm:relative sm:grow">
        {children}
      </div>
    </div>
  );
}
