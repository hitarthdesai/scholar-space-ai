import { AddAssignmentDialog } from "./AddAssignmentDialog";
import { Button } from "../ui/button";
import { BookAIcon, BookPlusIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { DeleteAssignmentButton } from "./DeleteAssignmentButton";
import { getClassroomAssignments } from "@/utils/classroom/getClassroomAssignments";
import { auth } from "@/utils/auth/config";
import { EnumRole } from "@/schemas/userSchema";
import { RenameAssignmentButton } from "./RenameAssignmentButton";

type ClassroomProps = {
  id: string;
};

export async function Classroom({ id }: ClassroomProps) {
  const assignments = await getClassroomAssignments({ classroomId: id });
  const doesNotHaveAssignments =
    assignments === null || assignments.length === 0;

  const session = await auth();
  const isAuthorizedToCreateOrDeleteAssignment =
    session?.user?.role === EnumRole.Teacher;

  return (
    <div className="flex h-full w-full flex-col">
      {/* <section className="p-4">
        {doesNotHaveStudents ? (
          <div className="flex">
            <AddStudentDialog classroomId={id} />
            <div className="flex grow items-center justify-center text-center">
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
      <Separator /> */}
      <section className="grow p-4">
        {doesNotHaveAssignments ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <BookPlusIcon className="h-16 w-16" />
            <div className="flex max-w-60 text-center md:min-w-max">
              <p>There are no assignments for this classroom.</p>
            </div>
            {isAuthorizedToCreateOrDeleteAssignment && (
              <AddAssignmentDialog
                classroomId={id}
                trigger={<Button>Create an assignment</Button>}
              />
            )}
          </div>
        ) : (
          <>
            <ul className="flex grow flex-wrap gap-4">
              {assignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="aspect-video min-w-72 max-w-72"
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
                        <Button className="flex w-full items-center justify-center gap-2">
                          View <BookAIcon />
                        </Button>
                      </Link>
                      {isAuthorizedToCreateOrDeleteAssignment && (
                        <>
                          <RenameAssignmentButton
                            assignmentId={assignment.id}
                          />
                          <DeleteAssignmentButton
                            assignmentId={assignment.id}
                          />
                        </>
                      )}
                    </CardFooter>
                  </Card>
                </li>
              ))}
              {isAuthorizedToCreateOrDeleteAssignment && (
                <li>
                  <AddAssignmentDialog classroomId={id} />
                </li>
              )}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
