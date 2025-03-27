import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { getQuestionSubmissionUsers } from "@/utils/classroom/getQuestionSubmissionUsers";
import { AlertOctagonIcon } from "lucide-react";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { SubmissionTitle } from "./SubmissionTitle";
import { Accordion } from "@/components/ui/accordion";

type QuestionSubmissionProps = {
  classroomId: string;
  assignmentId: string;
};

export async function SubmissionsByQuestions({
  classroomId,
  assignmentId,
}: QuestionSubmissionProps) {
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
      </div>
    );
  }

  // const questionsWithSubmissions = await Promise.all(
  //   questions.map(async (question) => {
  //     const submissions = await getQuestionSubmissionUsers({
  //       questionId: question.id,
  //     });
  //     const usernames = submissions.map(
  //       (submission: { username: string | null }) =>
  //         submission.username ?? "Unknown"
  //     );
  //     return { ...question, usernames };
  //   })
  // );

  return (
    <ol className="flex max-w-6xl flex-col gap-3 px-2 sm:px-0">
      {/* <Accordion
        type="multiple"
        className="w-full border-x border-t border-border"
      >
        {questionsWithSubmissions.map(({ id, name, type, usernames }) => {
          return (
            <li className="flex flex-row items-center" key={id}>
              <SubmissionTitle
                isAuthorizedToAddOrDelete={isAuthorizedToAddOrDelete}
                userIds={usernames}
                classroomId={classroomId}
                assignmentId={assignmentId}
                questionId={id}
                name={name}
                type={type}
              />
            </li>
          );
        })}
      </Accordion> */}
    </ol>
  );
}
