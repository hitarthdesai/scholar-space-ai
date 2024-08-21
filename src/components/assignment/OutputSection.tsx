"use client";

import { useCodeContext } from "@/contexts/CodeContext";

export function OutputSection() {
  const { output } = useCodeContext();

  return (
    <>
      <div className="w-full text-center">Output</div>
      <div className="w-full grow">
        {output ?? "Run your code to get some output"}
      </div>
    </>
  );
}
