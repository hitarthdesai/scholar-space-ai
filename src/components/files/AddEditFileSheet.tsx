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
import { EnumFormMode } from "@/schemas/formSchema";
import { type AddEditFileSheetProps } from "@/schemas/fileSchema";
import { AddFileForm } from "./AddFileForm";
import { EditFileForm } from "./EditFileForm";
import { fileSheetDescription, fileSheetTitle } from "@/utils/constants/file";

export function AddEditFileSheet({
  children,
  ...props
}: PropsWithChildren<AddEditFileSheetProps>) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{fileSheetTitle[mode]}</SheetTitle>
          <SheetDescription>{fileSheetDescription[mode]}</SheetDescription>
        </SheetHeader>
        {mode === EnumFormMode.Add ? (
          <AddFileForm {...props} setIsOpen={setIsOpen} />
        ) : (
          <EditFileForm {...props} setIsOpen={setIsOpen} />
        )}
      </SheetContent>
    </Sheet>
  );
}
