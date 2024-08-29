"use client";

import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { DeleteAssignmentDialog } from "./DeleteAssignmentDialog";

type DeleteAssignmentButtonProps = {
  assignmentId: string;
};

export function DeleteAssignmentButton({
  assignmentId,
}: DeleteAssignmentButtonProps) {
  return (
    <DeleteAssignmentDialog
      assignmentId={assignmentId}
      trigger={
        <Button variant="destructive">
          <TrashIcon />
        </Button>
      }
    />
  );
}
