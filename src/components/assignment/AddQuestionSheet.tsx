"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookPlus } from "lucide-react";
import { AddQuestionFormComponent as AddQuestionForm } from "./AddQuestionForm";
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";

export type AddQuestionSheetProps = {
  assignmentId: string;
  trigger?: ReactNode;
};

function DefaultAddAssignmentTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border border-dashed"
    >
      <BookPlus className="h-16 w-16" />
    </Button>
  );
}

export function AddQuestionSheet({
  assignmentId,
  trigger = <DefaultAddAssignmentTrigger />,
}: AddQuestionSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="max-w-72 sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Add Question</SheetTitle>
          <SheetDescription>
            Enter your Question&apos;s text here. Then, click add to add this
            Question to your assignment.
          </SheetDescription>
        </SheetHeader>
        <AddQuestionForm assignmentId={assignmentId} setIsOpen={setIsOpen} />
        <SheetFooter>
          <Button type="submit" form={FormIds.AddQuestion}>
            Add
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
