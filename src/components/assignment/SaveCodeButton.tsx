"use client";

import { Loader2, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { saveCode } from "@/actions/saveCode";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { useEffect, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { EnumSaveCodeResult } from "@/schemas/questionSchema";

function ErrorAutoSavingCode() {
  return (
    <Dialog open>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Error auto-saving your attempt</DialogTitle>
          <DialogDescription>
            We were unable to save your attempt. Do not close this tab unless
            you ensure you store a copy of your attempt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>I understand</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SaveCodeButton() {
  const isMounted = useRef(false);
  const { code, questionId } = useCodeContext();
  const { executeAsync, isExecuting, execute, result } = useAction(saveCode, {
    onSettled({ result: { data } }) {
      if (!data) return;
    },
  });

  const debouncedCode = useDebounce(code, 1000);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    execute({ questionId, code: debouncedCode });
  }, [questionId, debouncedCode, execute]);

  const isErrorInSaving =
    !!result?.data?.type && result.data.type !== EnumSaveCodeResult.CodeSaved;
  return (
    <Button
      variant="outline"
      className="flex h-8 w-24 items-center justify-center gap-2"
      onClick={async () => await executeAsync({ questionId, code })}
      disabled={isExecuting}
    >
      {isExecuting ? (
        <Loader2 className="animate-spin p-0.5" />
      ) : (
        <>
          Save <SaveIcon aria-hidden />
        </>
      )}
      {isErrorInSaving && <ErrorAutoSavingCode />}
    </Button>
  );
}
