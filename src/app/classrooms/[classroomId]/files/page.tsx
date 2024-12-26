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
import { FilePlusIcon } from "lucide-react";
import { FilesTable } from "./FilesTable";
import { getClassroomFilesFromDb } from "@/utils/classroom/getClassroomFilesFromDb";

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

  const files = await getClassroomFilesFromDb({ classroomId });
  const numberOfFiles = files.length;
  const doesNotHaveFiles = numberOfFiles == 0;

  const isAuthorizedToCreateOrDeleteFiles = await canUserAccessClassroom({
    classroomId,
    userId,
    accessType: EnumAccessType.Write,
  });

  if (doesNotHaveFiles) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <FilePlusIcon className="h-16 w-16" />
        <div className="flex max-w-60 text-center md:min-w-max">
          <p>There are no files for this classroom.</p>
        </div>
        {isAuthorizedToCreateOrDeleteFiles && (
          <AddEditFileSheet mode={EnumFormMode.Add} classroomId={classroomId}>
            <Button>Add a file</Button>
          </AddEditFileSheet>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Class Files ({numberOfFiles})</h2>
        {isAuthorizedToCreateOrDeleteFiles && (
          <AddEditFileSheet mode={EnumFormMode.Add} classroomId={classroomId}>
            <Button className="flex flex-col items-center justify-center sm:flex-row">
              <FilePlusIcon className="mr-2 h-4 w-4" />
              Add File
            </Button>
          </AddEditFileSheet>
        )}
      </div>
      <FilesTable
        files={files}
        canAddOrEditFiles={isAuthorizedToCreateOrDeleteFiles}
        classroomId={classroomId}
      />
    </div>
  );
}
