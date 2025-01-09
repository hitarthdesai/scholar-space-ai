"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";

type SubmitQuestionDialogProps = {
  questionId: string;
};

export function SubmitQuestionDialog({
  questionId,
}: SubmitQuestionDialogProps) {
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
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          className="mr-auto flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-300 hover:text-black"
        >
          Submit <SendHorizonalIcon aria-hidden />
        </Button>
      </DialogTrigger>
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
