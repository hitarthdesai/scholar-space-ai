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
      className="h-16 w-16 rounded-full border-dashed p-4 sm:h-24 sm:w-24"
      variant="outline"
    >
      <BookPlus className="h-full w-full" />
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
            your s.
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
