import { type ClassroomDetails } from "@/schemas/classroomSchema";
import { Separator } from "../ui/separator";
import { FileIcon, FilePlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import Link from "next/link";
import { AddStudentDialog } from "./AddStudentDialog";

type ClassroomProps = {
  classroom: ClassroomDetails;
};

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
      <section className="p-4">
        {doesNotHaveStudents ? (
          <div className="flex">
            <AddStudentDialog classroomId={id} />
            <div className="flex grow items-center justify-center">
              <p>There are no students in this classroom.</p>
            </div>
          </div>
        ) : (
          <div className="flex">
            <ul className="grow">
              {students.map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ul>
            <AddStudentDialog classroomId={id} />
          </div>
        )}
      </section>
      <Separator />
      <section className="grow">
        {doesNotHaveAssignments ? <NoAssignmentsContent id={id} /> : <ul></ul>}
      </section>
    </div>
  );
}
