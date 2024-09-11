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
    <ol className="flex flex-col">
      {questions.map(({ id, name }) => (
        <li key={id}>
          <Link href={`/questions/${id}`}>
            <Button variant="link">{name}</Button>
          </Link>
        </li>
      ))}
      {isAuthorizedToAddOrDelete && (
        <li>
          <AddQuestionSheet
            assignmentId={assignmentId}
            trigger={
              <Button className="mt-2 flex gap-2">
                Add another question <ShieldQuestionIcon />
              </Button>
            }
          />
        </li>
      )}
    </ol>
  );
}
