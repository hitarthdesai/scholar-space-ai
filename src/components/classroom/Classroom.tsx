import { type ClassroomDetails } from "@/schemas/classroomSchema";
import { Separator } from "../ui/separator";
import {
  EnvelopeClosedIcon,
  FileIcon,
  FilePlusIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";

type ClassroomProps = {
  classroom: ClassroomDetails;
};

function NoStudentsContent({ id }: Pick<ClassroomDetails, "id">) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <PersonIcon className="h-12 w-12" />
      <p>There are no students in this classroom.</p>
      <Link href={`/classrooms/${id}/invite`}>
        <Button className="flex items-center gap-2">
          Invite students <EnvelopeClosedIcon />
        </Button>
      </Link>
    </div>
  );
}

function NoAssignmentsContent({ id }: Pick<ClassroomDetails, "id">) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
      <FileIcon className="h-12 w-12" />
      <p>There are no assignments for this classroom.</p>
      <Link href={`/classrooms/${id}/assignments/create`}>
        <Button className="flex items-center gap-2">
          Create assignment <FilePlusIcon />
        </Button>
      </Link>
    </div>
  );
}

export function Classroom({
  classroom: { id, name, students },
}: ClassroomProps) {
  const doesNotHaveStudents = students === null || students.length === 0;

  // TODO: Change this after implementing assignments
  const doesNotHaveAssignments = true;
  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="text-xl font-semibold">{name}</h1>
      <section className="grow">
        {doesNotHaveStudents ? (
          <NoStudentsContent id={id} />
        ) : (
          <ul>
            {students.map((student) => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>
        )}
      </section>
      <Separator />
      <section className="grow">
        {doesNotHaveAssignments ? <NoAssignmentsContent id={id} /> : <ul></ul>}
      </section>
    </div>
  );
}
