import { auth } from "@/utils/auth/config";
import assert from "assert";
import { getUserClassroomsFromDb } from "@/utils/classroom/getUserClassroomsFromDb";
import { ComponentNoneIcon } from "@radix-ui/react-icons";
import { ClassroomCard } from "./classroom/ClassroomCard";

export default async function LoggedInClassroomCards() {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const classrooms = await getUserClassroomsFromDb({ userId });
  const numberOfClassrooms = classrooms.length;

  return (
    <>
      {numberOfClassrooms > 0 ? (
        <div className="flex flex-row flex-wrap justify-center gap-4 sm:justify-start">
          {classrooms.slice(0, 3).map((classroom) => {
            return <ClassroomCard key={classroom.id} classroom={classroom} />;
          })}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <ComponentNoneIcon
              className="h-24 w-24 text-gray-400"
              aria-hidden
            />
            <p className="max-w-48 text-center">
              No classrooms found. Try using different filters.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
