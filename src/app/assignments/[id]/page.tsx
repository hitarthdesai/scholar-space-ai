import { AssignmentQuestions } from "@/components/assignment/AssignmentQuestions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { getAssignmentFromDb } from "@/utils/classroom/getAssignmentFromDb";
import assert from "assert";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AssignmentPage({
  params: { id: assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isAuthorized = await canUserAccessAssignment({
    assignmentId,
    userId,
    accessType: EnumAccessType.Read,
  });
  if (!isAuthorized) {
    <NotAuthorizedToViewPage />;
  }

  const [assignment] = await getAssignmentFromDb({
    assignmentId,
  });

  return (
    <main className="flex h-full flex-col items-center p-4">
      <div className="w-full text-left font-semibold">
        Assignment Name: {assignment.name}
      </div>
      <div className="h-full w-full grow">
        <AssignmentQuestions assignmentId={assignmentId} />
      </div>
    </main>
  );
}
