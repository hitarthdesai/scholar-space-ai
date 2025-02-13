import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, PencilIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { auth } from "@/utils/auth/config";
import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { getObject } from "@/utils/storage/s3/getObject";
import { AddEditQuestionSheet } from "../question/AddEditQuestionSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";

type QuestionTitleProps = {
  id: string;
  name: string;
  href: string;
};

function QuestionTitle({ id, name, href }: QuestionTitleProps) {
  const namePromise = db
    .select({ name: questions.name, id: questions.id })
    .from(questions)
    .where(eq(questions.id, id))
    .then((data) => data[0]);
  const questionPromise = getObject({
    fileName: `questions/${id}/question.txt`,
  });
  const starterCodePromise = getObject({
    fileName: `questions/${id}/starterCode.txt`,
  });

  const editPromise = Promise.all([
    namePromise,
    questionPromise,
    starterCodePromise,
  ]);

  return (
    <li className="flex flex-row items-center">
      <Link href={href}>
        <Button variant="link">{name}</Button>
      </Link>
      <AddEditQuestionSheet mode={EnumFormMode.Edit} editPromise={editPromise}>
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
      {questions.map(({ id, name }) => {
        const href = `/classrooms/${classroomId}/assignments/${assignmentId}/questions/${id}`;
        return <QuestionTitle key={id} id={id} href={href} name={name} />;
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
