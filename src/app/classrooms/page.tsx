import { Classrooms } from "@/components/classroom/Classrooms";
import {
  ClassroomParticipantStatus,
  ClassroomRole,
} from "@/schemas/classroomSchema";
import { auth } from "@/utils/auth/config";
import { getUserClassroomsFromDb } from "@/utils/classroom/getUserClassroomsFromDb";
import assert from "assert";

type PageProps = {
  searchParams: {
    query?: string;
    role?: ClassroomRole;
    status?: ClassroomParticipantStatus;
  };
};

export default async function ClassroomsPage({ searchParams }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const classrooms = await getUserClassroomsFromDb({ userId, ...searchParams });
  return (
    <main className="flex h-full flex-col gap-4 p-4">
      <Classrooms classrooms={classrooms} searchParams={searchParams} />
    </main>
  );
}
