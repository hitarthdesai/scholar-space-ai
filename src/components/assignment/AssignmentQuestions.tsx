import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, PencilIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import ChooseQuestionTypeDialog from "../question/add/ChooseQuestionTypeDialog";
import { QuestionTitle } from "./QuestionTitle";

type AssignmentQuestionsProps = {
  classroomId: string;
  assignmentId: string;
};

export async function AssignmentQuestions({
  classroomId,
  assignmentId,
}: AssignmentQuestionsProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");
  const isAuthorizedToAddOrDelete = await canUserAccessAssignment({
    assignmentId,
    userId,
    accessType: EnumAccessType.Write,
  });

  const questions = await getAssignmentQuestionsFromDb({
    assignmentId,
  });

  if (!questions || questions.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <AlertOctagonIcon className="h-24 w-24" />
        <p>No questions found</p>
        {isAuthorizedToAddOrDelete && (
          <ChooseQuestionTypeDialog assignmentId={assignmentId}>
            <Button className="flex gap-2">
              Add a question <ShieldQuestionIcon />
            </Button>
          </ChooseQuestionTypeDialog>
        )}
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {questions.map(({ id, name, type }) => {
        return (
          <li className="flex flex-row items-center" key={id}>
            <QuestionTitle
              isAuthorizedToAddOrDelete={isAuthorizedToAddOrDelete}
              classroomId={classroomId}
              assignmentId={assignmentId}
              questionId={id}
              name={name}
              type={type}
            />
          </li>
        );
      })}
      {isAuthorizedToAddOrDelete && (
        <li>
          <ChooseQuestionTypeDialog assignmentId={assignmentId}>
            <Button className="mt-2 flex gap-2">
              Add another question <ShieldQuestionIcon />
            </Button>
          </ChooseQuestionTypeDialog>
        </li>
      )}
    </ol>
  );
}
