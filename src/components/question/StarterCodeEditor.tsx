"use client";

import { Editor } from "@monaco-editor/react";

type StarterCodeEditorProps = {
  code: string;
  onChange: (value: string) => void;
};

export function StarterCodeEditor({ code, onChange }: StarterCodeEditorProps) {
  return (
    <Editor
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
      defaultLanguage="python"
      value={code}
      onChange={(value) => onChange(value ?? "")}
    />
  );
}
