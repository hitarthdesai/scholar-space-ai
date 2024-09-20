"use client";

import { PlayIcon } from "lucide-react";
import { Button } from "../ui/button";
import { runCode } from "@/actions/runCode";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { useCallback } from "react";

export function RunCodeButton() {
  const { code, setOutput, questionId } = useCodeContext();
  const { executeAsync } = useAction(runCode, {
    onSettled({ result: { data } }) {
      if (!data) return;

      const { output } = data;
      setOutput(
        output ?? "There's a problem in running your code. Try again later."
      );
    },
  });

  const handleClick = useCallback(async () => {
    await executeAsync({ questionId });
  }, [questionId, code, executeAsync]);

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
