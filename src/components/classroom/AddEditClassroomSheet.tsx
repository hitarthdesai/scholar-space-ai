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
import { type AddEditClassroomSheetProps } from "@/schemas/classroomSchema";
import { AddClassroomForm } from "./AddClassroomForm";
import { EditClassroomForm } from "./EditClassroomForm";
import {
  classroomSheetDescription,
  classroomSheetTitle,
} from "@/utils/constants/classroom";

export function AddEditClassroomSheet({
  children,
  ...props
}: PropsWithChildren<AddEditClassroomSheetProps>) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{classroomSheetTitle[mode]}</SheetTitle>
          <SheetDescription>{classroomSheetDescription[mode]}</SheetDescription>
        </SheetHeader>
        {mode === EnumFormMode.Add ? (
          <AddClassroomForm {...props} setIsOpen={setIsOpen} />
        ) : (
          <EditClassroomForm {...props} setIsOpen={setIsOpen} />
        )}
      </SheetContent>
    </Sheet>
  );
}
