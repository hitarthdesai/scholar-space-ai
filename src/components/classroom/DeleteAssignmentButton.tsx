"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "../ui/use-toast";
import { deleteAssignment } from "@/actions/deleteAssignment";
import { EnumDeleteAssignmentResult } from "@/schemas/assignmentSchema";
import { toastDescriptionDeleteAssignment } from "@/utils/constants/toast";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteAssignmentButtonProps = {
  assignmentId: string;
};

export function DeleteAssignmentButton({
  assignmentId,
}: DeleteAssignmentButtonProps) {
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

      router.refresh();
    },
  });

  return (
    <Button
      onClick={() => executeAsync({ assignmentId })}
      variant="destructive"
    >
      <TrashIcon />
    </Button>
  );
}
