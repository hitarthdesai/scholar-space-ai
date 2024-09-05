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

export function CreateClassroomDialog({ trigger }: CreateClassroomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-full w-full border-dashed"
            variant="outline"
          >
            <PlusIcon />
          </Button>
        )}
      </DialogTrigger>
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
