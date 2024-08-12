import { Classroom } from "@/components/classroom/Classroom";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { auth } from "@/utils/auth/config";
import { getClassroomDetails } from "@/utils/classroom/getClassroomDetails";
import { CheckCircledIcon } from "@radix-ui/react-icons";

type PageProps = {
  params: {
    id: string;
  };
  searchParams: Record<string, string>;
};

export default async function ClassroomPage({
  params: { id: classroomId },
  searchParams,
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <PageForLoggedInUsersOnly />;
  }

  const classroom = await getClassroomDetails({ classroomId, userId });
  if (!classroom) {
    return <NotAuthorizedToViewPage />;
  }

  const justCreatedClassroom = searchParams.created === "true";

  return (
    <main className="flex h-full w-full flex-col p-4">
      {justCreatedClassroom && (
        // TODO: Add a close button to dismiss the alert
        // TODO: Make this message vanish after a few seconds
        <Alert>
          <CheckCircledIcon className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Your classroom has been created.</AlertDescription>
        </Alert>
      )}

      <div className="flex h-full grow items-center justify-center">
        <Classroom classroom={classroom} />
      </div>
    </main>
  );
}
