import { CreateClassroomFormComponent as CreateClassroomForm } from "@/components/classroom/CreateClassroomForm";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { EnumRole } from "@/schemas/userSchema";
import { auth } from "@/utils/auth/config";

export default async function CreateClassroomPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <PageForLoggedInUsersOnly />;
  }

  if (session?.user?.role !== EnumRole.Teacher) {
    return <NotAuthorizedToViewPage />;
  }

  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <CreateClassroomForm />
    </main>
  );
}
