import { AddEditAssignmentSheet } from "@/components/assignment/AddEditAssignmentSheet";
import { AssignmentCard } from "@/components/classroom/AssignmentCard";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumFormMode } from "@/schemas/formSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { getClassroomAssignments } from "@/utils/classroom/getClassroomAssignments";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";
import { BookPlus, BookPlusIcon } from "lucide-react";

type PageProps = {
  params: {
    classroomId: string;
  };
};

export default async function Assignments({
  params: { classroomId },
}: PageProps) {
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
    page: EnumPage.ClassroomAssignments,
    classroomId,
  });

  const assignments = await getClassroomAssignments({ classroomId });
  const numberOfAssignments = assignments.length;
  const doesNotHaveAssignments = numberOfAssignments === 0;

  const isAuthorizedToCreateOrDeleteAssignment = await canUserAccessClassroom({
    classroomId,
    userId,
    accessType: EnumAccessType.Write,
  });

  if (doesNotHaveAssignments) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <BookPlusIcon className="h-16 w-16" />
        <div className="flex max-w-60 text-center md:min-w-max">
          <p>There are no assignments for this classroom.</p>
        </div>
        {isAuthorizedToCreateOrDeleteAssignment && (
          <AddEditAssignmentSheet
            mode={EnumFormMode.Add}
            classroomId={classroomId}
          >
            <Button>Create an assignment</Button>
          </AddEditAssignmentSheet>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="text-2xl font-bold">
        Class Assignments ({numberOfAssignments})
      </h2>
      <ul className="flex flex-wrap gap-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="min-w-72 max-w-72">
            <AssignmentCard
              classroomId={classroomId}
              assignment={assignment}
              isAuthorizedToEditAssignment={
                isAuthorizedToCreateOrDeleteAssignment
              }
            />
          </li>
        ))}
        {isAuthorizedToCreateOrDeleteAssignment && (
          <li className="min-w-72 max-w-72">
            <AddEditAssignmentSheet
              mode={EnumFormMode.Add}
              classroomId={classroomId}
            >
              <Button
                variant="ghost"
                className="flex h-full min-w-72 max-w-72 items-center justify-center border border-dashed"
              >
                <BookPlus className="h-16 w-16" />
              </Button>
            </AddEditAssignmentSheet>
          </li>
        )}
      </ul>
    </div>
  );
}
