"use client";

import { RotateCcwIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { resetCode } from "@/actions/resetCode";
import { EnumResetCodeResult } from "@/schemas/questionSchema";
import { toast } from "../ui/use-toast";
import { toastDescriptionResetCode } from "@/utils/constants/toast";

export function ResetCodeButton() {
  const { questionId, updateCode } = useCodeContext();
  const { executeAsync } = useAction(resetCode, {
    onSettled({ result: { data } }) {
      if (!data) return;

      if (data.type === EnumResetCodeResult.CodeReset) {
        updateCode(data.code ?? "");
      }

      const isErroneous = data.type !== EnumResetCodeResult.CodeReset;
      toast({
        title: isErroneous
          ? "Error in resetting code"
          : "Question resetted successfully",
        description: toastDescriptionResetCode[data.type],
        variant: isErroneous ? "destructive" : "default",
      });
    },
  });

  const handleClick = async () => {
    await executeAsync({ questionId });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center justify-center gap-2"
      onClick={handleClick}
    >
      Reset <RotateCcwIcon aria-hidden />
    </Button>
  );
}
