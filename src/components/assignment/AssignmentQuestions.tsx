import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, PencilIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth/config";
import { getObject } from "@/utils/storage/s3/getObject";
import { AddEditQuestionSheet } from "../question/AddEditQuestionSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { EnumQuestionType } from "@/schemas/questionSchema";
import { getQuestionOptionsFromDb } from "@/utils/classroom/question/getQuestionOptionsFromDb";
import { ComponentProps } from "react";

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

function QuestionTitle({ id, name, ...props }: QuestionTitleProps) {
  const questionPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });

  const starterCodePromise = getObject({
    fileName: `questions/${id}/starterCode.txt`,
  });
  const editCodeQuestionPromise = Promise.all([
    questionPromise,
    starterCodePromise,
  ]);

  const optionsPromise = getQuestionOptionsFromDb({ questionId: id });
  const editSingleCorrectMcqQuestionPromise = Promise.all([
    questionPromise,
    optionsPromise,
  ]);

  const addEditQuestionSheetProps: ComponentProps<typeof AddEditQuestionSheet> =
    {
      mode: EnumFormMode.Edit,
      id,
      name,
      ...(props.type === EnumQuestionType.Code
        ? {
            type: EnumQuestionType.Code,
            editPromise: editCodeQuestionPromise,
          }
        : {
            type: EnumQuestionType.SingleCorrectMcq,
            editPromise: editSingleCorrectMcqQuestionPromise,
          }),
    };

  return (
    <li className="flex flex-row items-center">
      {props.type === EnumQuestionType.Code ? (
        <Link href={props.href}>
          <Button variant="link">{name}</Button>
        </Link>
      ) : (
        <Button variant="link">{name}</Button>
      )}
      <AddEditQuestionSheet {...addEditQuestionSheetProps}>
        <Button variant="ghost">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </AddEditQuestionSheet>
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
          <AddEditQuestionSheet
            mode={EnumFormMode.Add}
            assignmentId={assignmentId}
          >
            <Button className="flex gap-2">
              Add a question <ShieldQuestionIcon />
            </Button>
          </AddEditQuestionSheet>
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
          <AddEditQuestionSheet
            mode={EnumFormMode.Add}
            assignmentId={assignmentId}
          >
            <Button className="mt-2 flex gap-2">
              Add another question <ShieldQuestionIcon />
            </Button>
          </AddEditQuestionSheet>
        </li>
      )}
    </ol>
  );
}
