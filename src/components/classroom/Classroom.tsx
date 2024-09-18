import { AddEditAssignmentSheet } from "../assignment/AddEditAssignmentSheet";
import { Button } from "../ui/button";
import { BookPlus, BookPlusIcon } from "lucide-react";
import { getClassroomAssignments } from "@/utils/classroom/getClassroomAssignments";
import { auth } from "@/utils/auth/config";
import { EnumRole } from "@/schemas/userSchema";
import { EnumFormMode } from "@/schemas/formSchema";
import { AssignmentCard } from "./AssignmentCard";

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
    <div className="flex h-full w-full flex-col pt-4">
      <section className="grow">
        {doesNotHaveAssignments ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <BookPlusIcon className="h-16 w-16" />
            <div className="flex max-w-60 text-center md:min-w-max">
              <p>There are no assignments for this classroom.</p>
            </div>
            {isAuthorizedToCreateOrDeleteAssignment && (
              <AddEditAssignmentSheet mode={EnumFormMode.Add} classroomId={id}>
                <Button>Create an assignment</Button>
              </AddEditAssignmentSheet>
            )}
          </div>
        ) : (
          <>
            <ul className="flex grow flex-wrap gap-4">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="min-w-72 max-w-72">
                  <AssignmentCard
                    assignment={assignment}
                    isAuthorizedToEditAssignment={
                      isAuthorizedToCreateOrDeleteAssignment
                    }
                  />
                </li>
              ))}
              {isAuthorizedToCreateOrDeleteAssignment && (
                <li>
                  <AddEditAssignmentSheet
                    mode={EnumFormMode.Add}
                    classroomId={id}
                  >
                    <Button
                      variant="ghost"
                      className="flex h-full min-w-72 max-w-72 items-center justify-center border border-dashed"
                    >
                      <BookPlus className="h-16 w-16" />
                    </Button>
                  </AddEditAssignmentSheet>
                </li>
              )}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
