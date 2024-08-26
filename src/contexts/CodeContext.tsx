"use client";

import React, {
  createContext,
  PropsWithChildren,
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
};

const initialState: CodeContextState = {
  code: "",
  updateCode: () => undefined,
  output: "",
  setOutput: () => undefined,
};

export const CodeContext = createContext<CodeContextState>(initialState);

type CodeProviderProps = PropsWithChildren<{
  questionId: string;
}>;

export function CodeProvider({ children, questionId }: CodeProviderProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const storedCode = window.localStorage.getItem(questionId);
    if (storedCode) {
      setCode(storedCode);
    }

    return () => {
      new Promise(async (resolve) => {
        // TODO: Save file to the server, text to the database, etc.
        console.log("CodeProvider cleanup");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("CodeProvider cleanup done");
        resolve(1);
      });
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(questionId, code);
  }, [code]);

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
    [code, updateCode, output, setOutput]
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
