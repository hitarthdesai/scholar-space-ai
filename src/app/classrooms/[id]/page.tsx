import { Classroom } from "@/components/classroom/Classroom";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { auth } from "@/utils/auth/config";
import { getClassroomDetails } from "@/utils/classroom/getClassroomDetails";
import assert from "assert";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ClassroomPage({
  params: { id: classroomId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const classroom = await getClassroomDetails({ classroomId, userId });
  if (!classroom) {
    return <NotAuthorizedToViewPage />;
  }

  return (
    <main className="flex h-full w-full flex-col p-4">
      <Classroom classroom={classroom} />
    </main>
  );
}
