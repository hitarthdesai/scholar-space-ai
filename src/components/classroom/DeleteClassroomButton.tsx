"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "../ui/use-toast";
import { deleteClassroom } from "@/actions/deleteClassroom";
import { EnumDeleteClassroomResult } from "@/schemas/classroomSchema";
import { toastDescriptionDeleteClassroom } from "@/utils/constants/toast";
import { Button } from "../ui/button";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type DeleteClassroomButtonProps = {
  classroomId: string;
};

export function DeleteClassroomButton({
  classroomId,
}: DeleteClassroomButtonProps) {
  const router = useRouter();
  const { executeAsync } = useAction(deleteClassroom, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumDeleteClassroomResult.ClassroomDeleted;

      toast({
        title: isErroneous
          ? "Error in deleting classroom"
          : "Classroom deleted successfully",
        description: toastDescriptionDeleteClassroom[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      router.refresh();
    },
  });

  return (
    <Button onClick={() => executeAsync({ classroomId })} variant="destructive">
      <TrashIcon />
    </Button>
  );
}
