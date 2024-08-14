import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AddQuestionDialog } from "./AddQuestionDialog";
import Link from "next/link";

type AssignmentQuestionsProps = {
  assignmentId: string;
};
export async function AssignmentQuestions({
  assignmentId,
}: AssignmentQuestionsProps) {
  const questions = await getAssignmentQuestionsFromDb({
    assignmentId,
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <AlertOctagonIcon className="h-24 w-24" />
        <p>No questions found</p>
        <AddQuestionDialog
          assignmentId={assignmentId}
          trigger={
            <Button className="flex gap-2">
              Add a question <ShieldQuestionIcon />
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <ul>
      {questions.map((question, index) => (
        <li>
          <Link href={`/questions/${question.id}`}>
            <Button variant="link" className="flex gap-2">
              Question {index + 1}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
