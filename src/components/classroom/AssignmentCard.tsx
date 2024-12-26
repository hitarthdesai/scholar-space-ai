import { BookAIcon, PencilIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EnumFormMode } from "@/schemas/formSchema";
import { AddEditAssignmentSheet } from "../assignment/AddEditAssignmentSheet";
import Link from "next/link";

type AssignmentCardProps = {
  classroomId: string;
  assignment: {
    id: string;
    name: string;
  };
  isAuthorizedToEditAssignment: boolean;
};

export function AssignmentCard({
  classroomId,
  assignment,
  isAuthorizedToEditAssignment,
}: AssignmentCardProps) {
  return (
    <Card className="flex h-full w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{assignment.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center gap-2">
        <Link
          href={`/classrooms/${classroomId}/assignments/${assignment.id}`}
          className="w-full grow"
        >
          <Button className="flex w-full items-center justify-center gap-2">
            View <BookAIcon />
          </Button>
        </Link>
        {isAuthorizedToEditAssignment && (
          <AddEditAssignmentSheet
            mode={EnumFormMode.Edit}
            assignment={assignment}
          >
            <Button variant="secondary">
              <PencilIcon />
            </Button>
          </AddEditAssignmentSheet>
        )}
      </CardFooter>
    </Card>
  );
}
