import { DeleteConversationDialog } from "./DeleteConversationDialog";
import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

type DeleteConversationButtonProps = {
  conversationId: string;
};

export function DeleteConversationButton({
  conversationId,
}: DeleteConversationButtonProps) {
  return (
    <DeleteConversationDialog
      conversationId={conversationId}
      trigger={
        <Button
          className="flex flex-row items-center justify-center gap-2 border-none"
          variant="outline"
          name="Delete Conversation"
        >
          <TrashIcon className="h-4 w-4" />
          Delete
        </Button>
      }
    />
  );
}
