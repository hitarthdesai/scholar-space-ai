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
import { RejectInviteForm } from "./RejectInviteForm";
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";

type RejectInviteDialogProps = {
  classroomId: string;
  trigger?: ReactNode;
};

function DefaultRejectInviteTrigger() {
  return (
    <Button variant="ghost" className="grow">
      Reject
    </Button>
  );
}

export function RejectInviteDialog({
  classroomId,
  trigger = <DefaultRejectInviteTrigger />,
}: RejectInviteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
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
