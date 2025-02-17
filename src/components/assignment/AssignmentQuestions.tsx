import { getAssignmentQuestionsFromDb } from "@/utils/classroom/getAssignmentQuestionsFromDb";
import { AlertOctagonIcon, PencilIcon, ShieldQuestionIcon } from "lucide-react";
import { Button } from "../ui/button";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { canUserAccessAssignment } from "@/utils/classroom/canUserAccessAssignment";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import ChooseQuestionTypeDialog from "../question/add/ChooseQuestionTypeDialog";
import { type QuestionType } from "@/schemas/questionSchema";
import { EditQuestionDataWrapper } from "../question/edit/EditQuestionDataWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";

type QuestionTitleProps = {
  classroomId: string;
  assignmentId: string;
  questionId: string;
  name: string;
  type: QuestionType;
};

function QuestionTitle({ type, questionId, name }: QuestionTitleProps) {
  const displayConfig = questionDisplayConfigByType[type];

  return (
    <Accordion type="multiple" className="w-full border-x border-border">
      <AccordionItem value={questionId}>
        <div className="flex w-full items-center justify-between">
          <div className="w-full">
            <AccordionTrigger className="grow">
              <div className="flex flex-col gap-2 pl-4">
                <p>{name}</p>
                <Badge
                  className={cn(
                    "flex items-center gap-2",
                    displayConfig.badgeStyles
                  )}
                >
                  {displayConfig.icon}
                  {displayConfig.label}
                </Badge>
              </div>
            </AccordionTrigger>
          </div>
          <EditQuestionDataWrapper type={type} id={questionId}>
            <Button variant="ghost">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </EditQuestionDataWrapper>
        </div>
        <AccordionContent>Question Here</AccordionContent>
      </AccordionItem>
    </Accordion>
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
        return (
          <li className="flex flex-row items-center" key={id}>
            <QuestionTitle
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
