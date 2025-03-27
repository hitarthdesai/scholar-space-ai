import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

type SubmissionCardProps = {
  classroomId: string;
  assignment: {
    id: string;
    name: string;
    // submissionCount: number;
  };
};

export function SubmissionCard({
  classroomId,
  assignment,
}: SubmissionCardProps) {
  return (
    <Card className="flex h-full w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>{assignment.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center gap-2">
        <Link
          href={`/classrooms/${classroomId}/assignments/${assignment.id}/submissions`}
          className="w-full grow"
        >
          <Button className="flex w-full items-center justify-center gap-2">
            View Submissions <ClipboardList className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
