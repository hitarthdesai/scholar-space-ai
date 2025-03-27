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
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Link from "next/link";
import { ViewSingleCorrectMcq } from "../question/ViewSingleCorrectMcq";
import { getSingleCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getSingleCorrectMcqByIdForAttempt";
import { getMultiCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getMultiCorrectMcqByIdForAttempt";
import { ViewMultiCorrectMcq } from "../question/ViewMultiCorrectMcq";
import { Suspense } from "react";

type SubmissionTitleProps = {
  isAuthorizedToAddOrDelete: boolean;
  userIds: string[];
  classroomId: string;
  assignmentId: string;
  questionId: string;
  name: string;
  type: QuestionType;
};

export function SubmissionTitle({
  type,
  userIds,
  classroomId,
  assignmentId,
  questionId,
  name,
}: SubmissionTitleProps) {
  const displayConfig = questionDisplayConfigByType[type];

  const title = () => (
    <div className="flex items-center gap-2 pl-4">
      <p className="text-lg font-semibold">{name}</p>
      <Badge
        className={cn(
          "flex items-center gap-1 px-1 py-0.5 text-xs",
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
      case EnumQuestionType.SingleCorrectMcq: {
        const questionPromise = getSingleCorrectMcqByIdForAttempt({
          id: questionId,
          userId: userIds[0],
        });

        return <ViewSingleCorrectMcq questionPromise={questionPromise} />;
      }

      case EnumQuestionType.MultiCorrectMcq: {
        const questionPromise = getMultiCorrectMcqByIdForAttempt({
          id: questionId,
          userId: userIds[0],
        });

        return <ViewMultiCorrectMcq questionPromise={questionPromise} />;
      }

      case EnumQuestionType.Code:
        return (
          <div className="flex flex-col gap-2 pr-4">
            {userIds.map((userId) => (
              <div
                key={userId}
                className="flex items-center justify-between gap-2 pl-4"
              >
                <Badge className="flex items-center gap-1 px-2 py-1 text-xs">
                  {userId}
                </Badge>
                <Link
                  href={`/classrooms/${classroomId}/assignments/${assignmentId}/questions/${questionId}`}
                  target="_blank"
                >
                  <Button
                    size="sm"
                    className="flex max-w-32 items-center gap-2 sm:max-w-full"
                  >
                    <SquareArrowOutUpRightIcon className="h-4 w-4" />{" "}
                    <p className="hidden sm:block">
                      Attempt in the code editor
                    </p>
                    <p className="block sm:hidden">Attempt</p>
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AccordionItem value={questionId} className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full">
          <AccordionTrigger className="grow pr-4 hover:bg-secondary hover:no-underline">
            {title()}
          </AccordionTrigger>
        </div>
      </div>
      <AccordionContent>
        <Suspense fallback={<div>Loading the question...</div>}>
          {viewQuestion()}
        </Suspense>
      </AccordionContent>
    </AccordionItem>
  );
}
