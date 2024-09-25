import { RejectInviteDialog } from "./RejectInviteDialog";
import { Button } from "@/components/ui/button";

type RejectInviteButtonProps = {
  classroomId: string;
};

export function RejectInviteButton({ classroomId }: RejectInviteButtonProps) {
  return (
    <RejectInviteDialog
      classroomId={classroomId}
      trigger={
        <Button className="grow" variant="destructive" name="Reject Invite">
          Reject
        </Button>
      }
    />
  );
}
