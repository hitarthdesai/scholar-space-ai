"use client"; // This makes it a client-side component

import React, { useState } from "react";
import { Button } from "../ui/button";
import { SendHorizonalIcon } from "lucide-react"; // Make sure to import this

interface SubmitDialogProps {
  // Removed event handlers since they are handled within the component itself
}

const SubmitDialog: React.FC<SubmitDialogProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitClick = () => {
    setIsOpen(true);
  };

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const handleSubmitConfirm = () => {
    // Handle submit logic here
    console.log("Submit confirmed!");
    // Trigger any necessary backend actions for AI or submission
    handleDialogClose();
  };

  const handleSubmitCancel = () => {
    // Handle cancel logic
    console.log("Submit cancelled!");
    handleDialogClose();
  };

  return (
    <>
      <Button
        onClick={handleSubmitClick}
        className="mr-auto flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-300 hover:text-black"
      >
        Submit <SendHorizonalIcon aria-hidden />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-black p-6">
            <h2 className="text-lg font-semibold">
              Are you sure you want to submit?
            </h2>
            <div className="mt-4 flex justify-between gap-2">
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitDialog;
