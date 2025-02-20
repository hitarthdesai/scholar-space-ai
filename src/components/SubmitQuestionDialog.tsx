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
import { submitCode } from "@/actions/submitCode";
import { useAction } from "next-safe-action/hooks";
import { Loader2 } from "lucide-react";
import { EnumSubmitCodeResult } from "@/schemas/questionSchema";
import { useCodeContext } from "@/contexts/CodeContext";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionSubmitCode } from "@/utils/constants/toast";
import { useRouter } from "next/navigation";

type SubmitQuestionDialogProps = {
  questionId: string;
  disabled: boolean;
};

export function SubmitQuestionDialog({
  children,
  disabled,
}: PropsWithChildren<SubmitQuestionDialogProps>) {
  const { code, questionId } = useCodeContext();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { executeAsync, isExecuting: isSubmitting } = useAction(submitCode, {
    onSuccess: ({ data }) => {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumSubmitCodeResult.CodeSubmitted;
      toast({
        title: isErroneous
          ? "Error in submitting code"
          : "Code Submitted successfully",
        description: toastDescriptionSubmitCode[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      setIsOpen(false);

      if (!isErroneous) {
        router.refresh();
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Submit Code</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to submit your code? You will not be able to
          edit it after submission.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={async () => await executeAsync({ questionId, code })}
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
