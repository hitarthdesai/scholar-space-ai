import { Button } from "../ui/button";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { SquareArrowOutUpRightIcon, PencilIcon } from "lucide-react";
import { EditQuestionDataWrapper } from "@/components/question/edit/EditQuestionDataWrapper";
import Link from "next/link";

type QuestionTitleProps = {
  isAuthorizedToAddOrDelete: boolean;
  userId: string;
  classroomId: string;
  assignmentId: string;
  questionId: string;
  name: string;
  type: QuestionType;
};

export function QuestionTitle({
  type,
  classroomId,
  assignmentId,
  questionId,
  name,
  isAuthorizedToAddOrDelete,
}: QuestionTitleProps) {
  const displayConfig = questionDisplayConfigByType[type];

  const title = () => (
    <div className="flex flex-col gap-2 pl-4">
      <p>{name}</p>
      <Badge
        className={cn(
          "flex w-fit items-center gap-2",
          displayConfig.badgeStyles
        )}
      >
        {displayConfig.icon}
        {displayConfig.label}
      </Badge>
    </div>
  );

  const viewQuestion = () => {
    switch (type) {
      // case EnumQuestionType.SingleCorrectMcq: {
      //   const questionPromise = getSingleCorrectMcqByIdForAttempt({
      //     id: questionId,
      //     userId,
      //   });

      //   return (
      //     <ViewSingleCorrectMcq
      //       id={questionId}
      //       questionPromise={questionPromise}
      //     />
      //   );
      // }

      // case EnumQuestionType.MultiCorrectMcq:
      //   return <div>Multi Correct</div>;
      default:
        return null;
    }
  };

  return (
    <AccordionItem value={questionId} className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full">
          {type === EnumQuestionType.Code ? (
            <div className="flex items-center justify-between pr-4">
              <div className="pb-4 pt-2">{title()}</div>
              <Link
                href={`/classrooms/${classroomId}/assignments/${assignmentId}/questions/${questionId}`}
                target="_blank"
              >
                <Button
                  size="sm"
                  className="flex max-w-32 items-center gap-2 sm:max-w-full"
                >
                  <SquareArrowOutUpRightIcon className="h-4 w-4" />{" "}
                  <p className="hidden sm:block">Attempt in the code editor</p>
                  <p className="block sm:hidden">Attempt</p>
                </Button>
              </Link>
            </div>
          ) : (
            <AccordionTrigger className="grow pr-4 hover:bg-secondary hover:no-underline">
              {title()}
            </AccordionTrigger>
          )}
        </div>
        {isAuthorizedToAddOrDelete && (
          <div className="flex items-center">
            <EditQuestionDataWrapper type={type} id={questionId}>
              <Button variant="ghost">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </EditQuestionDataWrapper>
          </div>
        )}
      </div>
      {type !== EnumQuestionType.Code && (
        <AccordionContent>{viewQuestion()}</AccordionContent>
      )}
    </AccordionItem>
  );
}
