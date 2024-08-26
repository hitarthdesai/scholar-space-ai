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
import { DeleteIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteConversation } from "@/actions/deleteConversation";
import { EnumDeleteConversationResult } from "@/schemas/chatSchema";
import { toastDescriptionDeleteConversation } from "@/utils/constants/toast";
import { toast } from "./ui/use-toast";

type DeleteConversationDialogProps = {
  conversationId: string;
  trigger?: ReactNode;
};

function DefaultDeleteConversationTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      <DeleteIcon className="h-16 w-16" />
    </Button>
  );
}

export function DeleteConversationDialog({
  conversationId,
  trigger = <DefaultDeleteConversationTrigger />,
}: DeleteConversationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { executeAsync } = useAction(deleteConversation, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumDeleteConversationResult.ConversationDeleted;

      toast({
        title: isErroneous
          ? "Error in deleting classroom"
          : "Conversation deleted successfully",
        description: toastDescriptionDeleteConversation[data.type],
        variant: isErroneous ? "destructive" : "default",
      });
      if (!isErroneous) {
        setIsOpen(false);
        router.push(`/chat`);
        router.refresh();
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Conversation</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this conversation?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-700 text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500"
            onClick={() => executeAsync({ conversationId })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
