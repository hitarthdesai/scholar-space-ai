import { type ClassroomDetails } from "@/schemas/classroomSchema";
import { Separator } from "../ui/separator";
import { AddStudentDialog } from "./AddStudentDialog";
import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { Button } from "../ui/button";
import { BookAIcon, BookPlusIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DeleteAssignmentButton } from "./DeleteAssignmentButton";

type ClassroomProps = {
  classroom: ClassroomDetails;
};

export function Classroom({
  classroom: { id, name, students, assignments },
}: ClassroomProps) {
  const doesNotHaveStudents = students === null || students.length === 0;
  const doesNotHaveAssignments =
    assignments === null || assignments.length === 0;

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
            <ul className="flex grow gap-4">
              {assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="aspect-video min-w-52 max-w-52"
                >
                  <Card className="flex h-full w-full flex-col justify-between">
                    <CardHeader>
                      <CardTitle>{assignment.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-2">
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="grow"
                      >
                        <Button className="flex items-center justify-center gap-2">
                          View <BookAIcon />
                        </Button>
                      </Link>
                      <DeleteAssignmentButton assignmentId={assignment.id} />
                    </CardFooter>
                  </Card>
                </li>
              ))}
              <li>
                <AddAssignmentDialog classroomId={id} />
              </li>
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
