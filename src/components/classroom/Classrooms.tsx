import { type UserClassroom } from "@/schemas/classroomSchema";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AddEditClassroomSheet } from "./AddEditClassroomSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import { PlusIcon } from "lucide-react";
import { ClassroomCard } from "./ClassroomCard";

type ClassroomsProps = {
  classrooms: UserClassroom[];
};

export function Classrooms({ classrooms }: ClassroomsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 sm:justify-start">
      {/* TODO: Group these classrooms by the role current user plays in them */}
      {classrooms.map((classroom) => {
        return <ClassroomCard key={classroom.id} classroom={classroom} />;
      })}
      <Card className="grid max-h-32 min-h-32 min-w-72 max-w-72 place-items-center border-none">
        <AddEditClassroomSheet mode={EnumFormMode.Add}>
          <Button className="h-full w-full border-dashed" variant="outline">
            <PlusIcon />
          </Button>
        </AddEditClassroomSheet>
      </Card>
    </div>
  );
}
