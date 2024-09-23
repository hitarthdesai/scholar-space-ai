import {
  EnumClassroomRole,
  type UserClassroom,
} from "@/schemas/classroomSchema";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AddEditClassroomSheet } from "./AddEditClassroomSheet";
import { EnumFormMode } from "@/schemas/formSchema";
import { PlusIcon } from "lucide-react";
import { ClassroomCard } from "./ClassroomCard";
import {
  FilterClassroomsForm,
  type FilterClassroomsFormProps,
} from "./FilterClassroomsForm";
import { ComponentNoneIcon, Pencil1Icon } from "@radix-ui/react-icons";

type ClassroomsProps = {
  classrooms: UserClassroom[];
  searchParams: FilterClassroomsFormProps;
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
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4">
          <ComponentNoneIcon className="h-24 w-24 text-gray-400" aria-hidden />
          {searchParams.role === EnumClassroomRole.Admin ? (
            <>
              <p className="max-w-48 text-center">
                You don&apos;t have any classrooms yet.
              </p>
              <AddEditClassroomSheet mode={EnumFormMode.Add}>
                <Button className="flex items-center justify-center gap-2">
                  Create a classroom now <Pencil1Icon />
                </Button>
              </AddEditClassroomSheet>
            </>
          ) : (
            <p className="max-w-48 text-center">
              No classrooms found. Try using a different set of filters.
            </p>
          )}
        </div>
      )}
    </>
  );
}
