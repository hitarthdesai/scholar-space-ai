"use client";

import { useCodeContext } from "@/contexts/CodeContext";
import { Editor } from "@monaco-editor/react";

type SolutionEditorProps = {
  editable: boolean;
};

export function SolutionEditor({ editable }: SolutionEditorProps) {
  const { code, updateCode } = useCodeContext();
  return (
    <Editor
      theme="vs-dark"
      options={{ minimap: { enabled: false }, readOnly: !editable }}
      defaultLanguage="python"
      value={code}
      onChange={(value) => value && updateCode(value)}
    />
  );
}
