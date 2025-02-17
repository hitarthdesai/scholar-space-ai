import { Button } from "../ui/button";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/cn";
import { SquareArrowOutUpRightIcon, PencilIcon } from "lucide-react";
import { EditQuestionDataWrapper } from "@/components/question/edit/EditQuestionDataWrapper";

type QuestionTitleProps = {
  isAuthorizedToAddOrDelete: boolean;
  classroomId: string;
  assignmentId: string;
  questionId: string;
  name: string;
  type: QuestionType;
};

export function QuestionTitle({
  type,
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

  return (
    <Accordion
      type="multiple"
      className="w-full border-x border-t border-border"
    >
      <AccordionItem value={questionId}>
        <div className="flex w-full items-center justify-between">
          <div className="w-full">
            {type === EnumQuestionType.Code ? (
              <div className="flex items-center justify-between pr-4 hover:bg-secondary">
                <div className="pb-4 pt-2">{title()}</div>
                <Button className="flex items-center gap-2">
                  <SquareArrowOutUpRightIcon className="h-4 w-4" /> Attempt in
                  the code editor
                </Button>
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
        <AccordionContent>Question Here</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
