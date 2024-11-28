import { AssignmentCard } from "@/components/classroom/AssignmentCard";
import { ClassroomSidebar } from "@/components/classroom/ClassroomSidebar";
import { AddEditFileSheet } from "@/components/files/AddEditFileSheet";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumFormMode } from "@/schemas/formSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";
import { BookPlus, BookPlusIcon } from "lucide-react";

type PageProps = {
  params: {
    classroomId: string;
  };
};

export default async function Files({ params: { classroomId } }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User is not authenticated");

  const isAuthorized = await canUserAccessClassroom({
    classroomId,
    userId,
    accessType: EnumAccessType.Read,
  });
  if (!isAuthorized) {
    return <NotAuthorizedToViewPage />;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.ClassroomFiles,
    classroomId,
  });

  const numberOfFiles = 0;
  const doesNotHaveFiles = false;

  const isAuthorizedToCreateOrDeleteFiles = await canUserAccessClassroom({
    classroomId,
    userId,
    accessType: EnumAccessType.Write,
  });

  if (doesNotHaveFiles) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <BookPlusIcon className="h-16 w-16" />
        <div className="flex max-w-60 text-center md:min-w-max">
          <p>There are no files for this classroom.</p>
        </div>
        {isAuthorizedToCreateOrDeleteFiles && (
          <AddEditFileSheet mode={EnumFormMode.Add}>
            <Button>Create an assignment</Button>
          </AddEditFileSheet>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full justify-center p-4">
      <ClassroomSidebar classroomId={classroomId} />
      <div className="flex h-full w-full flex-col gap-4">
        <PageBreadcrumbs breadcrumbs={breadcrumbs} />
        <h2 className="text-2xl font-bold">Class Files ({numberOfFiles})</h2>
        <ul className="flex flex-wrap gap-4">
          {/* {files.map((assignment) => (
            <li key={assignment.id} className="min-w-72 max-w-72">
              <AssignmentCard
                classroomId={classroomId}
                assignment={assignment}
                isAuthorizedToEditAssignment={isAuthorizedToCreateOrDeleteFiles}
              />
            </li>
          ))} */}
          {isAuthorizedToCreateOrDeleteFiles && (
            <li className="min-w-72 max-w-72">
              <AddEditFileSheet
                mode={EnumFormMode.Add}
                // classroomId={classroomId}
              >
                <Button
                  variant="ghost"
                  className="flex h-full min-w-72 max-w-72 items-center justify-center border border-dashed"
                >
                  <BookPlus className="h-16 w-16" />
                </Button>
              </AddEditFileSheet>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
