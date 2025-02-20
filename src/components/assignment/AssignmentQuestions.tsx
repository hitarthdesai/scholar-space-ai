import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import ChooseQuestionTypeDialog from "../question/add/ChooseQuestionTypeDialog";
import { QuestionTitle } from "./QuestionTitle";
import { Accordion } from "@/components/ui/accordion";

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
    <ol className="flex max-w-6xl flex-col gap-3 px-2 sm:px-0">
      <Accordion
        type="multiple"
        className="w-full border-x border-t border-border"
        defaultValue={[questions.map(({ id }) => id)[1]]}
      >
        {questions.map(({ id, name, type }) => {
          return (
            <li className="flex flex-row items-center" key={id}>
              <QuestionTitle
                isAuthorizedToAddOrDelete={isAuthorizedToAddOrDelete}
                userId={userId}
                classroomId={classroomId}
                assignmentId={assignmentId}
                questionId={id}
                name={name}
                type={type}
              />
            </li>
          );
        })}
      </Accordion>
      {isAuthorizedToAddOrDelete && (
        <li>
          <ChooseQuestionTypeDialog assignmentId={assignmentId}>
            <Button size="sm" className="mt-2 flex gap-2">
              Add another question <ShieldQuestionIcon />
            </Button>
          </ChooseQuestionTypeDialog>
        </li>
      )}
    </ol>
  );
}
