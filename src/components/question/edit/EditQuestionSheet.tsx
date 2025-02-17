"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type PropsWithChildren, useState } from "react";
import { type EditQuestionSheetProps } from "@/schemas/questionSchema";
import { editQuestionSheetConfigByQuestionType } from "@/utils/constants/question";
import { EditQuestionForm } from "./EditQuestionForm";

export function EditQuestionSheet({
  children,
  type,
  editPromise,
}: PropsWithChildren<EditQuestionSheetProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const sheetConfig = editQuestionSheetConfigByQuestionType[type];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{sheetConfig.title}</SheetTitle>
          <SheetDescription>{sheetConfig.description}</SheetDescription>
        </SheetHeader>
        <EditQuestionForm
          editPromise={editPromise}
          closeSheet={() => setIsOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
