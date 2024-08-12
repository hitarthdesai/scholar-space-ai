"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { FormIds } from "@/utils/constants/form";
import { CreateClassroomFormComponent as CreateClassroomForm } from "./CreateClassroomForm";
import { type ReactNode, useState } from "react";

type CreateClassroomDialogProps = {
  trigger?: ReactNode;
};

function DefaultCreateClassroomTrigger() {
  return (
    <Button className="h-full w-full border-none p-4" variant="outline">
      <PlusIcon />
    </Button>
  );
}

export function CreateClassroomDialog({
  trigger = <DefaultCreateClassroomTrigger />,
}: CreateClassroomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create classroom</DialogTitle>
          <DialogDescription>
            Enter details for your new classroom, and then click add.
          </DialogDescription>
        </DialogHeader>
        <CreateClassroomForm setIsOpen={setIsOpen} />
        <DialogFooter>
          <Button type="submit" form={FormIds.CreateClassroom}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
