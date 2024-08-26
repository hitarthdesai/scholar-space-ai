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
import { BookPlus } from "lucide-react";
import { AddAssignmentFormComponent as AddAssignmentForm } from "./AddAssignmentForm";
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";

type AddAssignmentDialogProps = {
  classroomId: string;
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

export function AddAssignmentDialog({
  classroomId,
  trigger = <DefaultAddAssignmentTrigger />,
}: AddAssignmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add assignment</DialogTitle>
          <DialogDescription>
            Give your assignment a name. Then, click add to make it available to
            your students.
          </DialogDescription>
        </DialogHeader>
        <AddAssignmentForm classroomId={classroomId} setIsOpen={setIsOpen} />
        <DialogFooter>
          <Button type="submit" form={FormIds.AddAssignment}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
