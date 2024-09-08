import { type Classroom } from "@/schemas/classroomSchema";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { CreateClassroomDialog } from "./CreateClassroomDialog";
import { DeleteClassroomButton } from "./DeleteClassroomButton";
import { auth } from "@/utils/auth/config";
import { EnumRole } from "@/schemas/userSchema";
import { RenameClassroomButton } from "./RenameClassroomButton";

type ClassroomsProps = {
  classrooms: Classroom[];
};

export async function Classrooms({ classrooms }: ClassroomsProps) {
  const session = await auth();
  const isAllowedToCreateOrDeleteClassrooms =
    session?.user?.role === EnumRole.Teacher;

  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 sm:justify-start">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="min-w-72 max-w-72">
          <CardHeader>
            <CardTitle>{classroom.name}</CardTitle>
          </CardHeader>
          <CardFooter className="flex items-center justify-center gap-2">
            <Link href={`/classrooms/${classroom.id}`} className="grow">
              <Button className="flex w-full items-center gap-1">
                View <MagnifyingGlassIcon />
              </Button>
            </Link>
            {isAllowedToCreateOrDeleteClassrooms && (
              <>
                <RenameClassroomButton classroomId={classroom.id} />
                <DeleteClassroomButton classroomId={classroom.id} />
              </>
            )}
          </CardFooter>
        </Card>
      ))}
      {isAllowedToCreateOrDeleteClassrooms && (
        <Card className="grid max-h-32 min-h-32 min-w-72 max-w-72 place-items-center border-none">
          <CreateClassroomDialog />
        </Card>
      )}
    </div>
  );
}
