import {
  type FilterClassroomsForm as FilterClassroomsFormType,
  type UserClassroom,
} from "@/schemas/classroomSchema";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AddEditClassroomSheet } from "./AddEditClassroomSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import { PlusIcon } from "lucide-react";
import { ClassroomCard } from "./ClassroomCard";
import { FilterClassroomsForm } from "./FilterClassroomsForm";
import { ComponentNoneIcon, Pencil1Icon } from "@radix-ui/react-icons";

type ClassroomsProps = {
  classrooms: UserClassroom[];
  searchParams: FilterClassroomsFormType;
};

export function Classrooms({ classrooms, searchParams }: ClassroomsProps) {
  const numberOfClassrooms = classrooms.length;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Your classrooms ({numberOfClassrooms})
        </h2>
        <FilterClassroomsForm {...searchParams} />
      </div>
      {numberOfClassrooms > 0 ? (
        <div className="flex flex-row flex-wrap justify-center gap-4 sm:justify-start">
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
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <ComponentNoneIcon
              className="h-24 w-24 text-gray-400"
              aria-hidden
            />
            <p className="max-w-48 text-center">
              No classrooms found. Try using different filters.
            </p>
          </div>
          <div className="relative flex w-full max-w-48 flex-col items-center justify-center text-center">
            <hr className="absolute w-full" />
            <span className="absolute z-50 bg-background p-1">OR</span>
          </div>
          <AddEditClassroomSheet mode={EnumFormMode.Add}>
            <Button className="flex items-center justify-center gap-2">
              Create a classroom now <Pencil1Icon />
            </Button>
          </AddEditClassroomSheet>
        </div>
      )}
    </>
  );
}
