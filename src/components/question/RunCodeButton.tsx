"use client";

import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import { runCode } from "@/actions/runCode";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { useCallback } from "react";

export function RunCodeButton() {
  const { setOutput, setStatus, questionId } = useCodeContext();
  const { executeAsync } = useAction(runCode, {
    onSettled({ result: { data } }) {
      if (!data) return;

      const { output, status } = data;
      setOutput(
        output ?? "There's a problem in running your code. Try again later."
      );
      setStatus(status ?? "Unknown status");
    },
  });

  const handleClick = useCallback(async () => {
    await executeAsync({ questionId });
  }, [questionId, executeAsync]);

  return (
    <Button
      variant="outline"
      className="flex items-center justify-center gap-2"
      onClick={handleClick}
    >
      Run <PlayIcon aria-hidden />
    </Button>
  );
}
