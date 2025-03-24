import { AddEditAssignmentSheet } from "@/components/assignment/AddEditAssignmentSheet";
import { AssignmentCard } from "@/components/classroom/AssignmentCard";
import { SubmissionCard } from "@/components/classroom/SubmissionCard";
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

export default async function Submissions({
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
    page: EnumPage.ClassroomSubmissions,
    classroomId,
  });

  const assignments = await getClassroomAssignments({ classroomId });
  const numberOfAssignments = assignments.length;
  const doesNotHaveAssignments = numberOfAssignments === 0;

  if (doesNotHaveAssignments) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3">
        <BookPlusIcon className="h-16 w-16" />
        <div className="flex max-w-60 text-center md:min-w-max">
          <p>There are no assignments for this classroom.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <h2 className="text-2xl font-bold">Class Submissions</h2>
      <ul className="flex flex-wrap gap-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="min-w-72 max-w-72">
            <SubmissionCard classroomId={classroomId} assignment={assignment} />
          </li>
        ))}
      </ul>
    </div>
  );
}
