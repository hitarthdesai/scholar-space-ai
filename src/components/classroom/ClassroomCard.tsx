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

export type ClassroomCardProps = {
  classroom: UserClassroom;
};

const roleBadgeStyles = {
  [EnumClassroomRole.Admin]: "bg-red-500 text-white",
  [EnumClassroomRole.Student]: "bg-blue-500 text-white",
  [EnumClassroomRole.Teacher]: "bg-green-500",
  [EnumClassroomRole.TeachingAssistant]: "bg-yellow-500",
};

const statusBadgeStyles = {
  [EnumClassroomParticpantStatus.Accepted]: "border-green-500 text-green-500",
  [EnumClassroomParticpantStatus.Pending]: "border-yellow-500 text-yellow-500",
  [EnumClassroomParticpantStatus.Invited]: "border-red-500 text-red-500",
};

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  const { id, name, role, status } = classroom;
  const canEditOrDeleteClassroom = role === EnumClassroomRole.Admin;

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
        <Link href={`/classrooms/${id}`} className="grow">
          <Button className="flex w-full items-center gap-2">
            View <SearchIcon />
          </Button>
        </Link>
        {canEditOrDeleteClassroom && (
          <AddEditClassroomSheet mode={EnumFormMode.Edit} classroom={classroom}>
            <Button variant="secondary">
              <PencilIcon />
            </Button>
          </AddEditClassroomSheet>
        )}
      </CardFooter>
    </Card>
  );
}
