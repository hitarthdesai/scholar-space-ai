"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type PropsWithChildren, Suspense, useState } from "react";
import { type AddEditQuestionSheetProps } from "@/schemas/questionSchema";
import {
  questionSheetDescription,
  questionSheetTitle,
} from "@/utils/constants/question";
import { Loader2 } from "lucide-react";
import { EditQuestionForm } from "./EditQuestionForm";
import { EnumFormMode } from "@/schemas/formSchema";

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
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{questionSheetTitle[mode]}</SheetTitle>
          <SheetDescription>{questionSheetDescription[mode]}</SheetDescription>
        </SheetHeader>
        {mode === EnumFormMode.Edit && (
          <Suspense fallback={<EditQuestionFormFallback />}>
            <EditQuestionForm {...props} setIsOpen={setIsOpen} />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}
