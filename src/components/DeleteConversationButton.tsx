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
          className="group h-6 w-6 flex-shrink-0 rounded-md"
          variant="outline"
          size="icon"
          name="Delete Conversation"
        >
          <TrashIcon className="h-4 w-4 group-hover:text-red-500" />
        </Button>
      }
    />
  );
}
