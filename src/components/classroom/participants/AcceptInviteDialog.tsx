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
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";
import { AcceptInviteForm } from "./AcceptInviteForm";

type AcceptInviteDialogProps = {
  trigger?: ReactNode;
  classroomId: string;
};

function DefaultAcceptInviteTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      Accept
    </Button>
  );
}

export function AcceptInviteDialog({
  trigger = <DefaultAcceptInviteTrigger />,
  classroomId,
}: AcceptInviteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Accept Invite</DialogTitle>
          <DialogDescription>
            Accept the invite to join the classroom.
          </DialogDescription>
        </DialogHeader>
        <AcceptInviteForm classroomId={classroomId} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
