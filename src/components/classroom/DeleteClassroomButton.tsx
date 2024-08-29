"use client";

import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { DeleteClassroomDialog } from "./DeleteClassroomDialog";

type DeleteClassroomButtonProps = {
  classroomId: string;
};

export function DeleteClassroomButton({
  classroomId,
}: DeleteClassroomButtonProps) {
  return (
    <DeleteClassroomDialog
      classroomId={classroomId}
      trigger={
        <Button variant="destructive">
          <TrashIcon />
        </Button>
      }
    />
  );
}
