import { RenameConversationDialog } from "./RenameConversationDialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

type RenameConversationButtonProps = {
  conversationId: string;
};

export function RenameConversationButton({
  conversationId,
}: RenameConversationButtonProps) {
  return (
    <RenameConversationDialog
      conversationId={conversationId}
      trigger={
        <Button
          className="flex flex-row items-center justify-center gap-2 border-none"
          variant="outline"
          name="Rename Conversation"
        >
          <Pencil2Icon className="h-4 w-4" />
          Rename
        </Button>
      }
    />
  );
}
