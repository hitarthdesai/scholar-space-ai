"use client";
import { SubmitQuestionDialog } from "./SubmitQuestionDialog";
import { SendHorizonalIcon } from "lucide-react";
import { Button } from "./ui/button";

type SubmitQuestionButtonProps = {
  questionId: string;
};

export function SubmitQuestionButton({
  questionId,
}: SubmitQuestionButtonProps) {
  const handleSubmitClick = () => {
    // Add your submit logic here
  };

  return (
    <SubmitQuestionDialog
      questionId={questionId}
      trigger={
        <Button
          onClick={handleSubmitClick}
          className="mr-auto flex items-center justify-center gap-2 bg-green-700 text-white hover:bg-green-300 hover:text-black"
        >
          Submit <SendHorizonalIcon aria-hidden />
        </Button>
      }
    />
  );
}
