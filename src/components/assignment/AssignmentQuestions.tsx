import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AddQuestionSheet } from "./AddQuestionSheet";
import Link from "next/link";
import { auth } from "@/utils/auth/config";
import { EnumRole } from "@/schemas/userSchema";

type AssignmentQuestionsProps = {
  assignmentId: string;
};

export async function AssignmentQuestions({
  assignmentId,
}: AssignmentQuestionsProps) {
  const session = await auth();
  const isAuthorizedToAddOrDelete = session?.user?.role === EnumRole.Teacher;

  const questions = await getAssignmentQuestionsFromDb({
    assignmentId,
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <AlertOctagonIcon className="h-24 w-24" />
        <p>No questions found</p>
        {isAuthorizedToAddOrDelete && (
          <AddQuestionSheet
            assignmentId={assignmentId}
            trigger={
              <Button className="flex gap-2">
                Add a question <ShieldQuestionIcon />
              </Button>
            }
          />
        )}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      <div className="">
        {questions.map((question, index) => (
          <li key={question.id}>
            <Link href={`/questions/${question.id}`}>
              <Button variant="link" className="flex gap-2">
                Question {index + 1}
              </Button>
            </Link>
          </li>
        ))}
      </div>
      {isAuthorizedToAddOrDelete && (
        <li>
          <AddQuestionSheet
            assignmentId={assignmentId}
            trigger={
              <Button className="flex gap-2">
                Add another question <ShieldQuestionIcon />
              </Button>
            }
          />
        </li>
      )}
    </ul>
  );
}
