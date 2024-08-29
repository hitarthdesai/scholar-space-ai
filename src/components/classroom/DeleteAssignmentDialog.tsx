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
import { TrashIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { deleteAssignment } from "@/actions/deleteAssignment";
import { EnumDeleteAssignmentResult } from "@/schemas/assignmentSchema";
import { toastDescriptionDeleteAssignment } from "@/utils/constants/toast";
import { toast } from "../ui/use-toast";

type DeleteAssignmentDialogProps = {
  assignmentId: string;
  trigger?: ReactNode;
};

function DefaultDeleteAssignmentTrigger() {
  return (
    <Button
      variant="ghost"
      className="flex aspect-video h-full min-w-52 max-w-52 items-center justify-center border-[1px] border-dashed"
    >
      <TrashIcon className="h-16 w-16" />
    </Button>
  );
}

export function DeleteAssignmentDialog({
  assignmentId,
  trigger = <DefaultDeleteAssignmentTrigger />,
}: DeleteAssignmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { executeAsync } = useAction(deleteAssignment, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumDeleteAssignmentResult.AssignmentDeleted;

      toast({
        title: isErroneous
          ? "Error in deleting assignment"
          : "Assignment deleted successfully",
        description: toastDescriptionDeleteAssignment[data.type],
        variant: isErroneous ? "destructive" : "default",
      });
      if (!isErroneous) {
        setIsOpen(false);
        router.refresh();
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Assignment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this assignment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-red-700 text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500"
            onClick={() => executeAsync({ assignmentId })}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
