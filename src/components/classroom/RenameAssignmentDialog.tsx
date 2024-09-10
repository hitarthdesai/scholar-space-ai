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
import { PencilIcon } from "lucide-react";
import { RenameAssignmentFormComponent as RenameAssignmentForm } from "./RenameAssignmentForm";
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";

type RenameAssignmentDialogProps = {
  assignmentId: string;
  trigger?: ReactNode;
};

function DefaultRenameAssignmentTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      <PencilIcon className="h-16 w-16" />
    </Button>
  );
}

export function RenameAssignmentDialog({
  assignmentId,
  trigger = <DefaultRenameAssignmentTrigger />,
}: RenameAssignmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Assignment</DialogTitle>
          <DialogDescription>
            Rename your assignment and click rename to save the changes.
          </DialogDescription>
        </DialogHeader>
        <RenameAssignmentForm
          assignmentId={assignmentId}
          setIsOpen={setIsOpen}
        />
        <DialogFooter>
          <Button type="submit" form={FormIds.RenameAssignment}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
