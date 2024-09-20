import { AddEditParticipantSheet } from "@/components/classroom/users/AddEditParticpantSheet";
import { UsersTable } from "@/components/classroom/users/UsersTable";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumFormMode } from "@/schemas/formSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { getClassroomParticipantsFromDb } from "@/utils/classroom/getClassroomParticipantsFromDb";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";
import { UserPlus } from "lucide-react";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function Participants({
  params: { id: classroomId },
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
    page: EnumPage.ClassroomParticipants,
    classroomId,
  });

  const participants = await getClassroomParticipantsFromDb({ classroomId });
  const numberOfParticipants = participants.length;

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Class Participants ({numberOfParticipants})
        </h2>
        <AddEditParticipantSheet
          mode={EnumFormMode.Add}
          classroomId={classroomId}
        >
          <Button className="flex flex-col items-center justify-center sm:flex-row">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Participant
          </Button>
        </AddEditParticipantSheet>
      </div>
      <UsersTable users={participants} />
    </div>
  );
}
