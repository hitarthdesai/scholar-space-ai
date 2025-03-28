import { BookAIcon, PencilIcon, Calculator } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { EnumFormMode } from "@/schemas/formSchema";
import { AddEditAssignmentSheet } from "../assignment/AddEditAssignmentSheet";
import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import Link from "next/link";

type AssignmentCardProps = {
  classroomId: string;
  assignment: {
    id: string;
    name: string;
  };
  isAuthorizedToEditAssignment: boolean;
};

export async function AssignmentCard({
  classroomId,
  assignment,
  isAuthorizedToEditAssignment,
}: AssignmentCardProps) {
  const questions = await getAssignmentQuestionsFromDb({
    assignmentId: assignment.id,
  });
  const totalPoints =
    questions?.reduce((acc, question) => acc + (question.grade || 0), 0) || 0;

  return (
    <Card className="flex h-full w-full flex-col justify-between">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{assignment.name}</CardTitle>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 font-medium text-primary"
          >
            <Calculator className="h-4 w-4" />
            Total Points: {totalPoints}
          </Badge>
        </div>
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
