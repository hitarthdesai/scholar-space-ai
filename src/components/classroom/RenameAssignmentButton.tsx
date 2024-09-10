"use client";

import { RenameAssignmentDialog } from "./RenameAssignmentDialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

type RenameAssignmentButtonProps = {
  assignmentId: string;
};

export function RenameAssignmentButton({
  assignmentId,
}: RenameAssignmentButtonProps) {
  return (
    <RenameAssignmentDialog
      assignmentId={assignmentId}
      trigger={
        <Button variant="outline" name="Rename Assignment">
          <Pencil2Icon className="h-6 w-6" />
        </Button>
      }
    />
  );
}
