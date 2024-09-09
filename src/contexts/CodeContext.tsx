"use client";

import React, {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type CodeContextState = {
  code: string;
  updateCode: (newCode: string) => void;
  output: string;
  setOutput: (newOutput: string) => void;
  questionId: string;
};

const initialState: CodeContextState = {
  code: "",
  updateCode: () => undefined,
  output: "",
  setOutput: () => undefined,
  questionId: "",
};

export const CodeContext = createContext<CodeContextState>(initialState);

type CodeProviderProps = PropsWithChildren<{
  questionId: string;
  initialValue: string;
}>;

export function CodeProvider({
  children,
  questionId,
  initialValue,
}: CodeProviderProps) {
  const [code, setCode] = useState(initialValue);
  const [output, setOutput] = useState("");

  useEffect(() => {
    const storedCode = window.localStorage.getItem(questionId);
    if (storedCode) {
      setCode(storedCode);
    }
  }, [questionId]);

  useEffect(() => {
    window.localStorage.setItem(questionId, code);
  }, [code, questionId]);

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const codeContextValue = useMemo(
    () => ({
      code,
      updateCode,
      output,
      setOutput,
      questionId,
    }),
    [code, updateCode, output, setOutput, questionId]
  );

  return (
    <CodeContext.Provider value={codeContextValue}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCodeContext() {
  return useContext(CodeContext);
}
