"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { Editor } from "@monaco-editor/react";

type SolutionEditorProps = {
  notEdittable: boolean;
};

export function SolutionEditor({ notEdittable }: SolutionEditorProps) {
  const { code, updateCode } = useCodeContext();
  return (
    <Editor
      theme="vs-dark"
      options={{ minimap: { enabled: false }, readOnly: !!notEdittable }}
      defaultLanguage="python"
      value={code}
      onChange={(value) => value && updateCode(value)}
    />
  );
}
