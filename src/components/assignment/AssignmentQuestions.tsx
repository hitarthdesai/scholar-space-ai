import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import {
  AlertOctagonIcon,
  SendHorizonalIcon,
  ShieldQuestionIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/utils/auth/config";
import { Badge } from "../ui/badge";
import { Calculator } from "lucide-react";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import ChooseQuestionTypeDialog from "../question/add/ChooseQuestionTypeDialog";
import { QuestionTitle } from "./QuestionTitle";
import { Accordion } from "@/components/ui/accordion";
import { SubmitAssignmentDialog } from "../SubmitAssignmentDialog";
import { getAssignmentSubmissionForUserFromDb } from "@/utils/classroom/getAssignmentSubmissionForUserFromDb";
import { getUserRoleInClassroom } from "@/utils/classroom/getUserRoleInClassroom";
import { EnumClassroomRole } from "@/schemas/classroomSchema";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { EnumQuestionType } from "@/schemas/questionSchema";

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

  const submitted = await getAssignmentSubmissionForUserFromDb({
    assignmentId,
    userId,
  });
  const isAssignmentSubmitted = !!submitted;
  const isStudent =
    (await getUserRoleInClassroom({
      classroomId,
      userId,
    })) === EnumClassroomRole.Student;

  return (
    <div className="flex w-full flex-col gap-2">
      <ol className="flex max-w-6xl flex-col gap-3 px-2 sm:px-0">
        {isAssignmentSubmitted && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You have already submitted this assignment. Therefore, you cannot
              modify your answers or re-submit this assignment.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Questions ({questions.length})
          </h2>
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 bg-primary/10 px-3 py-2 font-medium text-primary"
          >
            <Calculator className="h-4 w-4" />
            Total Points:{" "}
            {questions.reduce((acc, question) => {
              if (question.grade) {
                return acc + question.grade;
              }
              return acc;
            }, 0)}
          </Badge>
        </div>
        <Accordion
          type="multiple"
          className="w-full border-x border-t border-border"
          defaultValue={questions
            .filter(({ type }) => type === EnumQuestionType.Code)
            .map(({ id }) => id)}
        >
          {questions.map(({ id, name, type, grade }) => {
            return (
              <li className="flex flex-row items-center" key={id}>
                <QuestionTitle
                  isAuthorizedToAddOrDelete={isAuthorizedToAddOrDelete}
                  isViewOnly={isAssignmentSubmitted || !isStudent}
                  userId={userId}
                  classroomId={classroomId}
                  assignmentId={assignmentId}
                  questionId={id}
                  name={name}
                  type={type}
                  grade={grade}
                />
              </li>
            );
          })}
        </Accordion>
      </ol>

      <div>
        {isAuthorizedToAddOrDelete ? (
          <ChooseQuestionTypeDialog assignmentId={assignmentId}>
            <Button size="sm" className="flex gap-2">
              Add another question <ShieldQuestionIcon />
            </Button>
          </ChooseQuestionTypeDialog>
        ) : (
          <SubmitAssignmentDialog
            assignmentId={assignmentId}
            disabled={isAssignmentSubmitted}
          >
            <Button
              className="mr-auto flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-300 hover:text-black"
              disabled={isAssignmentSubmitted}
            >
              Submit <SendHorizonalIcon aria-hidden />
            </Button>
          </SubmitAssignmentDialog>
        )}
      </div>
    </div>
  );
}
