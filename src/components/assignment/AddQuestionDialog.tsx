"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookPlus, UserPlus } from "lucide-react";
import { AddQuestionFormComponent as AddQuestionForm } from "../assignment/AddQuestionForm";
import { FormIds } from "@/utils/constants/form";
import { ReactNode, useState } from "react";

export type AddQuestionDialogProps = {
  assignmentId: string;
  trigger?: ReactNode;
};

function DefaultAddAssignmentTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      <BookPlus className="h-16 w-16" />
    </Button>
  );
}

export function AddQuestionDialog({
  assignmentId,
  trigger = <DefaultAddAssignmentTrigger />,
}: AddQuestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Question</DialogTitle>
          <DialogDescription>
            Enter your Question&apos;s text here. Then, click add to add this
            Question to your assignment.
          </DialogDescription>
        </DialogHeader>
        <AddQuestionForm assignmentId={assignmentId} setIsOpen={setIsOpen} />
        <DialogFooter>
          <Button type="submit" form={FormIds.AddQuestion}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
