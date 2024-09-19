import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import { RenameConversationDialog } from "./RenameConversationDialog";

type RenameConversationButtonProps = {
  conversationId: string;
  closeDropdown?: () => void;
};

export function RenameConversationButton({
  conversationId,
  closeDropdown,
}: RenameConversationButtonProps) {
  return (
    <RenameConversationDialog
      conversationId={conversationId}
      closeDropdown={closeDropdown}
      trigger={
        <Button variant="ghost" className="w-full justify-start">
          <PencilIcon className="mr-2 h-4 w-4" />
          Rename
        </Button>
      }
    />
  );
}
