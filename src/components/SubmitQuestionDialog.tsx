"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type PropsWithChildren, useState } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizonalIcon } from "lucide-react";

type SubmitQuestionDialogProps = {
  questionId: string;
};

export function SubmitQuestionDialog({
  questionId,
  children,
}: PropsWithChildren<SubmitQuestionDialogProps>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitConfirm = () => {
    // Handle submit logic here
    console.log("Submit confirmed!");
    // Trigger any necessary backend actions for AI or submission
    setIsOpen(false);
  };

  const handleSubmitCancel = () => {
    // Handle cancel logic
    console.log("Submit cancelled!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Are you sure you want to submit?
            <br />
            This cannot be undone.
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button
            onClick={handleSubmitCancel}
            className="bg-gray-500 text-white hover:bg-gray-400"
          >
            Cancel
          </Button>
          <div className="flex-grow"></div>
          <Button
            onClick={handleSubmitConfirm}
            className="bg-green-700 text-white hover:bg-green-300"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
