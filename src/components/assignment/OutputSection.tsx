"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { InfoIcon } from "lucide-react";

export function OutputSection() {
  const { output } = useCodeContext();
  const isThereAnyOutput = output.length > 0;

  return (
    <>
      <div className="w-full text-center">Output</div>
      <div className="h-full w-full grow text-muted">
        {isThereAnyOutput ? (
          <>{output}</>
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
