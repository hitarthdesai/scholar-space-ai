import { AcceptInviteDialog } from "./AcceptInviteDialog";
import { Button } from "@/components/ui/button";

type AcceptInviteButtonProps = {
  classroomId: string;
};

export function AcceptInviteButton({ classroomId }: AcceptInviteButtonProps) {
  return (
    <AcceptInviteDialog
      trigger={
        <Button className="grow rounded-md" name="Accept Invite">
          Accept
        </Button>
      }
      classroomId={classroomId}
    />
  );
}
