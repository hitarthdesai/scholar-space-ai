import { AddEditParticipantSheet } from "@/components/classroom/participants/AddEditParticpantSheet";
import { UsersTable } from "@/components/classroom/participants/UsersTable";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { Button } from "@/components/ui/button";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumFormMode } from "@/schemas/formSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { canUserManageParticipants } from "@/utils/classroom/canUserManageParticipants";
import { getClassroomParticipantsFromDb } from "@/utils/classroom/getClassroomParticipantsFromDb";
import { EnumPage } from "@/utils/constants/page";
import assert from "assert";
import { UserPlus } from "lucide-react";

type PageProps = {
  params: {
    classroomId: string;
  };
};

export default async function Participants({
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
    page: EnumPage.ClassroomParticipants,
    classroomId,
  });

  const participants = await getClassroomParticipantsFromDb({ classroomId });
  const numberOfParticipants = participants.length;

  const canAddOrEditParticipants = await canUserManageParticipants({
    classroomId,
    userId,
  });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Class Participants ({numberOfParticipants})
        </h2>
        {canAddOrEditParticipants && (
          <AddEditParticipantSheet
            mode={EnumFormMode.Add}
            classroomId={classroomId}
          >
            <Button className="flex flex-col items-center justify-center sm:flex-row">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Participant
            </Button>
          </AddEditParticipantSheet>
        )}
      </div>
      <UsersTable
        classroomId={classroomId}
        canAddOrEditParticipants={canAddOrEditParticipants}
        users={participants}
      />
    </div>
  );
}
