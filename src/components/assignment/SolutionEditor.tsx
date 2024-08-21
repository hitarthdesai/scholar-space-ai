"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { Editor } from "@monaco-editor/react";

export function SolutionEditor() {
  const { code, updateCode } = useCodeContext();

  return (
    <Editor
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
      defaultLanguage="python"
      defaultValue=""
      value={code}
      onChange={(value) => value && updateCode(value)}
    />
  );
}
