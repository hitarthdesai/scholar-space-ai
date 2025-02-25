"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { InfoIcon } from "lucide-react";

export function OutputSection() {
  const { output } = useCodeContext();
  const isThereAnyOutput = output.length > 0;
  const isError = output.toLowerCase().includes("traceback");
  const isWarning = output.toLowerCase().includes("warning");

  return (
    <>
      <div className="w-full text-center">Output</div>
      <div className="h-full w-full grow text-muted">
        {isThereAnyOutput ? (
          <div
            style={{
              color: isError ? "red" : isWarning ? "lightyellow" : "white",
              fontFamily: "monospace",
              fontSize: "16px",
            }}
          >
            {output}
          </div>
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
