"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { submitAssignmentAttempt } from "@/actions/submitAssignmentAttempt";
import { useAction } from "next-safe-action/hooks";
import { Loader2 } from "lucide-react";
import { EnumSubmitAssignmentAttemptResult } from "@/schemas/questionSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionSubmitAssignmentAttempt } from "@/utils/constants/toast";
import { useRouter } from "next/navigation";

type SubmitAssignmentDialogProps = {
  assignmentId: string;
  disabled: boolean;
};

export function SubmitAssignmentDialog({
  children,
  disabled,
  assignmentId,
}: PropsWithChildren<SubmitAssignmentDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { executeAsync, isExecuting: isSubmitting } = useAction(
    submitAssignmentAttempt,
    {
      onSuccess: ({ data }) => {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumSubmitAssignmentAttemptResult.Submitted;
        toast({
          title: isErroneous
            ? "Error in submitting assignment"
            : "Assignment submitted successfully",
          description: toastDescriptionSubmitAssignmentAttempt[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        setIsOpen(false);

        if (!isErroneous) {
          router.refresh();
        }
      },
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Submit Assignment
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to submit this attempt? You will not be able to
          submit again.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={async () => await executeAsync({ assignmentId })}
            disabled={isSubmitting || disabled}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin p-0.5" />
            ) : (
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
