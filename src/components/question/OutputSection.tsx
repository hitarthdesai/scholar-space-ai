"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { InfoIcon } from "lucide-react";
import cn from "classnames";

export function OutputSection() {
  const { output, status } = useCodeContext();
  const isThereAnyOutput = output.length > 0;

  const colorClass = cn({
    "text-red-500": status === "1",
    "text-white": status === "0",
    "text-yellow-500": status !== "0" && status !== "1",
  });

  return (
    <>
      <div className="w-full text-center">Output</div>
      <div className="h-full w-full grow text-muted">
        {isThereAnyOutput ? (
          <div className={cn(colorClass, "font-mono text-lg")}>{output}</div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <InfoIcon />
            Run code to get some output
          </div>
        )}
      </div>
    </>
  );
}
