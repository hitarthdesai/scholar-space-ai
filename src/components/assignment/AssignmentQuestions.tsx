import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, PencilIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import ChooseQuestionTypeDialog from "../question/add/ChooseQuestionTypeDialog";
import { EnumQuestionType } from "@/schemas/questionSchema";
import { EditQuestionDataWrapper } from "../question/edit/EditQuestionDataWrapper";

type QuestionTitleProps = {
  id: string;
  name: string;
} & (
  | {
      type: typeof EnumQuestionType.Code;
      href: string;
    }
  | {
      type:
        | typeof EnumQuestionType.SingleCorrectMcq
        | typeof EnumQuestionType.MultiCorrectMcq;
    }
);

function QuestionTitle({ type, id, name }: QuestionTitleProps) {
  // const editCodeQuestionPromise = Promise.all([
  //   questionPromise,
  //   starterCodePromise,
  // ]);

  // const optionsPromise = getQuestionOptionsFromDb({ questionId: id });
  // const editSingleCorrectMcqQuestionPromise = Promise.all([
  //   questionPromise,
  //   optionsPromise,
  // ]);

  return (
    <li className="flex flex-row items-center">
      <Button variant="link">{name}</Button>
      <EditQuestionDataWrapper type={type} id={id}>
        <Button variant="ghost">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </EditQuestionDataWrapper>
    </li>
  );
}

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
    <ol className="flex flex-col">
      {questions.map(({ id, name, type }) => {
        if (type === EnumQuestionType.Code) {
          const href = `/classrooms/${classroomId}/assignments/${assignmentId}/questions/${id}`;
          return (
            <QuestionTitle
              key={id}
              id={id}
              href={href}
              name={name}
              type={type}
            />
          );
        }

        return <QuestionTitle key={id} id={id} name={name} type={type} />;
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
