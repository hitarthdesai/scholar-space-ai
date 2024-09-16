"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { AddAssignmentFormComponent as AddAssignmentForm } from "./AddAssignmentForm";
import { type PropsWithChildren, Suspense, useState } from "react";
import { type AddEditAssignmentSheetProps } from "@/schemas/assignmentSchema";
import {
  assignmentSheetDescription,
  assignmentSheetTitle,
} from "@/utils/constants/assignment";
import { EnumFormMode } from "@/schemas/formSchema";
import { EditAssignmentForm } from "./EditAssignmentForm";

function EditAssignmentFormFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="animate-spin p-0.5" />
    </div>
  );
}

export function AddEditAssignmentSheet({
  children,
  ...props
}: PropsWithChildren<AddEditAssignmentSheetProps>) {
  const { mode } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{assignmentSheetTitle[mode]}</SheetTitle>
          <SheetDescription>
            {assignmentSheetDescription[mode]}
          </SheetDescription>
        </SheetHeader>
        {mode === EnumFormMode.Add ? (
          <AddAssignmentForm {...props} setIsOpen={setIsOpen} />
        ) : (
          <Suspense fallback={<EditAssignmentFormFallback />}>
            <EditAssignmentForm {...props} setIsOpen={setIsOpen} />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}
