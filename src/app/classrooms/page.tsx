import { AddEditClassroomSheet } from "@/components/classroom/AddEditClassroomSheet";
import { Classrooms } from "@/components/classroom/Classrooms";
import { Button } from "@/components/ui/button";
import { EnumFormMode } from "@/schemas/formSchema";
import { auth } from "@/utils/auth/config";
import { getUserClassroomsFromDb } from "@/utils/classroom/getUserClassroomsFromDb";
import { ComponentNoneIcon, Pencil1Icon } from "@radix-ui/react-icons";
import assert from "assert";

export default async function ClassroomsPage() {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const classrooms = await getUserClassroomsFromDb({ userId });
  if (classrooms.length === 0) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center gap-4">
        <ComponentNoneIcon className="h-24 w-24 text-gray-400" aria-hidden />
        <p className="max-w-48 text-center">
          You don&apos;t have any classrooms yet.
        </p>
        <AddEditClassroomSheet mode={EnumFormMode.Add}>
          <Button className="flex items-center justify-center gap-2">
            Create a classroom now <Pencil1Icon />
          </Button>
        </AddEditClassroomSheet>
      </main>
    );
  }

  return (
    <main className="flex h-full flex-col justify-between p-4">
      <Classrooms classrooms={classrooms} />
    </main>
  );
}
