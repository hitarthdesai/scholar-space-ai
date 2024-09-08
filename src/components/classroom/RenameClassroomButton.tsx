"use client";

import { RenameClassroomDialog } from "./RenameClassroomDialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

type RenameClassroomButtonProps = {
  classroomId: string;
};

export function RenameClassroomButton({
  classroomId,
}: RenameClassroomButtonProps) {
  return (
    <RenameClassroomDialog
      classroomId={classroomId}
      trigger={
        <Button variant="outline" name="Rename Classroom">
          <Pencil2Icon className="h-6 w-6" />
        </Button>
      }
    />
  );
}
