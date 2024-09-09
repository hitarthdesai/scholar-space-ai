"use client";

import { Loader2, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { saveCode } from "@/actions/saveCode";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { useCallback } from "react";

export function SaveCodeButton() {
  const { code, questionId } = useCodeContext();
  const { executeAsync, isExecuting } = useAction(saveCode, {
    onSettled({ result: { data } }) {
      if (!data) return;
    },
  });

  const handleClick = useCallback(async () => {
    const stuff = await executeAsync({ questionId, code });
  }, [questionId, code, executeAsync]);

  return (
    <Button
      variant="outline"
      className="flex h-8 w-24 items-center justify-center gap-2"
      onClick={handleClick}
      disabled={isExecuting}
    >
      {isExecuting ? (
        <>
          <Loader2 className="animate-spin p-0.5" />
        </>
      ) : (
        <>
          Save <SaveIcon aria-hidden />
        </>
      )}
    </Button>
  );
}
