import { Classrooms } from "@/components/classroom/Classrooms";
import { CreateClassroomDialog } from "@/components/classroom/CreateClassroomDialog";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { Button } from "@/components/ui/button";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";
import { getTeacherClassrooms } from "@/utils/classroom/getTeacherClassrooms";
import { ComponentNoneIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";

export default async function ClassroomsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <PageForLoggedInUsersOnly />;
  }

  if (session?.user?.role !== EnumRole.Teacher) {
    return <NotAuthorizedToViewPage />;
  }

  const classrooms = await getTeacherClassrooms({ teacherId: userId });
  if (classrooms.length === 0) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center gap-4">
        <ComponentNoneIcon className="h-24 w-24 text-gray-400" aria-hidden />
        <p className="max-w-48 text-center">
          You don&apos;t have any classrooms yet.
        </p>

        <CreateClassroomDialog
          trigger={
            <Button className="flex items-center justify-center gap-2">
              Create a classroom now <Pencil1Icon />
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col justify-between">
      <Classrooms classrooms={classrooms} />
    </main>
  );
}
