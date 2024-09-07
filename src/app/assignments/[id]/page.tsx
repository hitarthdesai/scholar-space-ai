import { AssignmentQuestions } from "@/components/assignment/AssignmentQuestions";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/utils/auth/config";
import { getAssignmentFromDb } from "@/utils/classroom/getAssignmentFromDb";
import assert from "assert";
import { SchoolIcon } from "lucide-react";
import Link from "next/link";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function AssignmentPage({
  params: { id: assignmentId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const _assignments = await getAssignmentFromDb({
    assignmentId,
    userId,
  });

  if (!_assignments || _assignments.length === 0) {
    <NotAuthorizedToViewPage />;
  }

  const assignment = _assignments[0];

  return (
    <main className="flex h-full flex-col items-center p-4">
      <Card className="flex w-full items-center justify-between">
        <CardHeader>
          <CardTitle>{assignment.name}</CardTitle>
          <CardDescription>
            for classroom: {assignment.classroomName}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-center p-0 pr-6">
          <Link href={`/classrooms/${assignment.classroomId}`}>
            <Button variant="outline" className="flex gap-2">
              Go to classroom <SchoolIcon />
            </Button>
          </Link>
        </CardFooter>
      </Card>
      <div className="h-full w-full grow">
        <AssignmentQuestions assignmentId={assignmentId} />
      </div>
    </main>
  );
}
