"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type PropsWithChildren, useState } from "react";
import { AcceptInviteForm } from "./AcceptInviteForm";

type AcceptInviteDialogProps = {
  classroomId: string;
};

export function AcceptInviteDialog({
  classroomId,
  children,
}: PropsWithChildren<AcceptInviteDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
