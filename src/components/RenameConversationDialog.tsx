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
import { RenameConversationFormComponent as RenameConversationForm } from "./RenameConversationForm";
import { FormIds } from "@/utils/constants/form";
import { type ReactNode, useState } from "react";

type RenameConversationDialogProps = {
  conversationId: string;
  trigger?: ReactNode;
  closeDropdown?: () => void;
};

function DefaultRenameConversationTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      <PencilIcon className="h-16 w-16" />
    </Button>
  );
}

export function RenameConversationDialog({
  conversationId,
  trigger = <DefaultRenameConversationTrigger />,
  closeDropdown,
}: RenameConversationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && closeDropdown) {
      closeDropdown();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Conversation</DialogTitle>
          <DialogDescription>
            Rename your conversation and click rename to save the changes.
          </DialogDescription>
        </DialogHeader>
        <RenameConversationForm
          conversationId={conversationId}
          setIsOpen={setIsOpen}
        />
        <DialogFooter>
          <Button
            type="submit"
            form={FormIds.RenameConversation}
            onClick={() => {
              setIsOpen(false);
              if (closeDropdown) closeDropdown();
            }}
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
