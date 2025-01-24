"use client";

import { BadgeAlertIcon, Loader2, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { saveCode } from "@/actions/saveCode";
import { useAction } from "next-safe-action/hooks";
import { useCodeContext } from "@/contexts/CodeContext";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { DialogTrigger } from "@radix-ui/react-dialog";

type ErrorAutoSavingCodeProps = {
  onDismiss: () => void;
};

function ErrorAutoSavingCode({ onDismiss }: ErrorAutoSavingCodeProps) {
  return (
    <Dialog
      open
      onOpenChange={(newValue) => {
        if (!newValue) onDismiss();
      }}
    >
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Error auto-saving your attempt</DialogTitle>
          <DialogDescription>
            We were unable to save your attempt. Do not close this tab unless
            you ensure you store a copy of your attempt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="destructive">I understand</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SaveCodeButton() {
  const isMounted = useRef(false);
  const [dismissedErrorDialog, setDismissedErrorDialog] = useState(false);
  const handleDismissErrorDialog = useCallback(
    () => setDismissedErrorDialog(true),
    []
  );

  const { code, questionId } = useCodeContext();
  const { executeAsync, isExecuting, execute, result } = useAction(saveCode);

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
  const shouldDisplayErrorDialog = isErrorInSaving && !dismissedErrorDialog;

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
          {isErrorInSaving ? (
            <>
              <p className="text-red-600">Error</p>
              <BadgeAlertIcon className="text-red-600" />
            </>
          ) : (
            <>
              Save <SaveIcon aria-hidden />
            </>
          )}
        </>
      )}
      {shouldDisplayErrorDialog && (
        <ErrorAutoSavingCode onDismiss={handleDismissErrorDialog} />
      )}
    </Button>
  );
}
