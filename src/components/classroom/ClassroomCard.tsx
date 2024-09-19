import { PencilIcon, SearchIcon } from "lucide-react";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AddEditClassroomSheet } from "./AddEditClassroomSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import Link from "next/link";
import {
  EnumClassroomRole,
  type UserClassroom,
} from "@/schemas/classroomSchema";

export type ClassroomCardProps = {
  classroom: UserClassroom;
};

export function ClassroomCard({ classroom }: ClassroomCardProps) {
  const canEditOrDeleteClassroom = classroom.role === EnumClassroomRole.Admin;

  return (
    <Card className="min-w-72 max-w-72">
      <CardHeader>
        <CardTitle>{classroom.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-center gap-2">
        <Link href={`/classrooms/${classroom.id}`} className="grow">
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
