import { PencilIcon, SearchIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AddEditClassroomSheet } from "./AddEditClassroomSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import Link from "next/link";
import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
  type UserClassroom,
} from "@/schemas/classroomSchema";
import { Badge } from "../ui/badge";
import { AcceptInviteDialog } from "./participants/AcceptInviteDialog";
import { RejectInviteDialog } from "./participants/RejectInviteDialog";
import { roleBadgeStyles, statusBadgeStyles } from "@/utils/constants/misc";

export type ClassroomCardProps = {
  classroom: UserClassroom;
};

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  const { id, name, role, status } = classroom;

  return (
    <Card className="min-w-72 max-w-72">
      <CardHeader>
        <CardTitle className="flex">
          {name}
          <div className="flex grow items-center justify-end gap-1">
            <Badge variant="outline" className={statusBadgeStyles[status]}>
              {status}
            </Badge>
            <Badge className={roleBadgeStyles[role]}>{role}</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-center gap-2">
        {status === EnumClassroomParticpantStatus.Accepted && (
          <>
            <Link href={`/classrooms/${id}`} className="grow">
              <Button className="flex w-full items-center gap-2">
                View <SearchIcon />
              </Button>
            </Link>
            {role === EnumClassroomRole.Admin && (
              <AddEditClassroomSheet
                mode={EnumFormMode.Edit}
                classroom={classroom}
              >
                <Button variant="secondary">
                  <PencilIcon />
                </Button>
              </AddEditClassroomSheet>
            )}
          </>
        )}
        {status === EnumClassroomParticpantStatus.Invited && (
          <div className="flex w-full gap-4">
            <RejectInviteDialog classroomId={id}>
              <Button className="grow rounded-md" variant="destructive">
                Reject
              </Button>
            </RejectInviteDialog>

            <AcceptInviteDialog classroomId={id}>
              <Button className="grow rounded-md">Accept</Button>
            </AcceptInviteDialog>
          </div>
        )}
        {status === EnumClassroomParticpantStatus.Pending && (
          <div className="flex w-full gap-4 rounded-md border px-1 py-2 text-xs">
            The request to join is pending approval
          </div>
        )}
        {status === EnumClassroomParticpantStatus.Rejected && (
          <div className="flex w-full gap-4 rounded-md border px-1 py-2 text-xs">
            You denied joining this classroom
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
