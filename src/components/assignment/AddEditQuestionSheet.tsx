"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddQuestionForm } from "./AddQuestionForm";
import { FormIds } from "@/utils/constants/form";
import { type PropsWithChildren, Suspense, useState } from "react";
import {
  type AddEditQuestionSheetProps,
  EnumQuestionFormMode,
  type QuestionFormMode,
} from "@/schemas/questionSchema";
import {
  questionSheetDescription,
  questionSheetTitle,
} from "@/utils/constants/question";
import { Loader2 } from "lucide-react";
import { EditQuestionForm } from "./EditQuestionForm";

function footer(mode: QuestionFormMode) {
  switch (mode) {
    case EnumQuestionFormMode.Add:
      return (
        <Button type="submit" form={FormIds.AddQuestion}>
          Add
        </Button>
      );
    case EnumQuestionFormMode.Edit:
      return (
        <Button type="submit" form={FormIds.EditQuestion}>
          Save
        </Button>
      );
  }
}

function EditQuestionFormFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="animate-spin p-0.5" />
    </div>
  );
}

export function AddEditQuestionSheet({
  children,
  ...props
}: PropsWithChildren<AddEditQuestionSheetProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = props;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="max-w-72 sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{questionSheetTitle[mode]}</SheetTitle>
          <SheetDescription>{questionSheetDescription[mode]}</SheetDescription>
        </SheetHeader>
        {mode === EnumQuestionFormMode.Add ? (
          <AddQuestionForm {...props} setIsOpen={setIsOpen} />
        ) : (
          <Suspense fallback={<EditQuestionFormFallback />}>
            <EditQuestionForm {...props} setIsOpen={setIsOpen} />
          </Suspense>
        )}
        <SheetFooter>{footer(mode)}</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
