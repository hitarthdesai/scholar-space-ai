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
import { ViewSingleCorrectMcq } from "../question/ViewSingleCorrectMcq";
import { getSingleCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getSingleCorrectMcqByIdForAttempt";
import { getMultiCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getMultiCorrectMcqByIdForAttempt";
import { ViewMultiCorrectMcq } from "../question/ViewMultiCorrectMcq";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type QuestionTitleProps = {
  isAuthorizedToAddOrDelete: boolean;
  isViewOnly: boolean;
  userId: string;
  classroomId: string;
  assignmentId: string;
  questionId: string;
  name: string;
  type: QuestionType;
  grade: number;
};

export function QuestionTitle({
  type,
  userId,
  classroomId,
  assignmentId,
  questionId,
  name,
  grade,
  isViewOnly,
  isAuthorizedToAddOrDelete,
}: QuestionTitleProps) {
  const displayConfig = questionDisplayConfigByType[type];

  const viewQuestion = () => {
    switch (type) {
      case EnumQuestionType.Code:
        return (
          <div className="flex items-center justify-between pr-4">
            <Link
              href={`/classrooms/${classroomId}/assignments/${assignmentId}/questions/${questionId}`}
              target="_blank"
            >
              <Button
                size="sm"
                className="flex max-w-32 items-center gap-2 sm:max-w-full"
              >
                <SquareArrowOutUpRightIcon className="h-4 w-4" />{" "}
                {isViewOnly ? (
                  <>
                    <p className="hidden sm:block">View in the code editor</p>
                    <p className="block sm:hidden">View</p>
                  </>
                ) : (
                  <>
                    <p className="hidden sm:block">
                      Attempt in the code editor
                    </p>
                    <p className="block sm:hidden">Attempt</p>
                  </>
                )}
              </Button>
            </Link>
          </div>
        );

      case EnumQuestionType.SingleCorrectMcq: {
        const questionPromise = getSingleCorrectMcqByIdForAttempt({
          id: questionId,
          userId,
        });

        return (
          <ViewSingleCorrectMcq
            disabled={isViewOnly}
            questionPromise={questionPromise}
          />
        );
      }

      case EnumQuestionType.MultiCorrectMcq:
        const questionPromise = getMultiCorrectMcqByIdForAttempt({
          id: questionId,
          userId,
        });

        return (
          <ViewMultiCorrectMcq
            disabled={isViewOnly}
            questionPromise={questionPromise}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AccordionItem value={questionId} className="w-full">
      <div className="flex w-full items-center justify-between">
        <Card className="w-full border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <AccordionTrigger
              headerClassname="flex w-full items-center justify-between"
              className="px-4 hover:bg-secondary hover:no-underline"
            >
              <CardTitle className="flex w-full flex-row items-center gap-2">
                <Badge
                  className={cn(
                    "flex w-fit items-center gap-2",
                    displayConfig.badgeStyles
                  )}
                >
                  {displayConfig.icon}
                </Badge>
                {name}{" "}
                <Badge variant="secondary">
                  {grade} {grade === 1 ? "point" : "points"}
                </Badge>
              </CardTitle>
            </AccordionTrigger>
            {isAuthorizedToAddOrDelete && (
              <div className="flex items-center">
                <EditQuestionDataWrapper type={type} id={questionId}>
                  <Button variant="ghost">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </EditQuestionDataWrapper>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <AccordionContent>
              <Suspense fallback={<div>Loading the question...</div>}>
                {viewQuestion()}
              </Suspense>
            </AccordionContent>
          </CardContent>
        </Card>
      </div>
    </AccordionItem>
  );
}
