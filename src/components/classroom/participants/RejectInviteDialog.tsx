"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RejectInviteForm } from "./RejectInviteForm";
import { type PropsWithChildren, useState } from "react";

type RejectInviteDialogProps = {
  classroomId: string;
};

export function RejectInviteDialog({
  classroomId,
  children,
}: PropsWithChildren<RejectInviteDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Invite</DialogTitle>
          <DialogDescription>
            Reject the invite to join this classroom.
          </DialogDescription>
        </DialogHeader>
        <RejectInviteForm classroomId={classroomId} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
