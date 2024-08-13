import { type ClassroomDetails } from "@/schemas/classroomSchema";
import { Separator } from "../ui/separator";
import { AddStudentDialog } from "./AddStudentDialog";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { Button } from "../ui/button";
import { BookPlusIcon } from "lucide-react";

type ClassroomProps = {
  classroom: ClassroomDetails;
};

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
      <section className="grow p-4">
        {doesNotHaveAssignments ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <BookPlusIcon className="h-16 w-16" />
            <div className="flex items-center justify-center">
              <p>There are no assignments for this classroom.</p>
            </div>
            <AddAssignmentDialog
              classroomId={id}
              trigger={<Button>Create an assignment</Button>}
            />
          </div>
        ) : (
          <>
            <ul></ul>
            <AddAssignmentDialog classroomId={id} />
          </>
        )}
      </section>
    </div>
  );
}
