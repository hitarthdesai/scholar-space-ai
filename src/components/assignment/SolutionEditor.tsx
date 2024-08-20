"use client";

import { Editor } from "@monaco-editor/react";

export function SolutionEditor() {
  return (
    <Editor
      theme="vs-dark"
      options={{ minimap: { enabled: false } }}
      defaultLanguage="javascript"
      defaultValue="// some comment"
    />
  );
}
