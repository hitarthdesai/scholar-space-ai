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
import { type AddEditParticipantSheetProps } from "@/schemas/classroomSchema";
import { InviteParticipantForm } from "./InviteParticipantForm";
import { EditClassroomForm } from "../EditClassroomForm";
import {
  classroomParticipantSheetDescription,
  classroomParticipantSheetTitle,
} from "@/utils/constants/classroom";

export function AddEditParticipantSheet({
  children,
  ...props
}: PropsWithChildren<AddEditParticipantSheetProps>) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{classroomParticipantSheetTitle[mode]}</SheetTitle>
          <SheetDescription>
            {classroomParticipantSheetDescription[mode]}
          </SheetDescription>
        </SheetHeader>
        {mode === EnumFormMode.Add ? (
          <InviteParticipantForm {...props} setIsOpen={setIsOpen} />
        ) : (
          <EditClassroomForm {...props} setIsOpen={setIsOpen} />
        )}
      </SheetContent>
    </Sheet>
  );
}
