import { RenameConversationDialog } from "./RenameConversationDialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

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
          className="h-6 w-6 flex-shrink-0 rounded-md"
          variant="outline"
          size="icon"
          name="Rename Conversation"
        >
          <Pencil2Icon className="h-4 w-4" />
        </Button>
      }
    />
  );
}
