import { type Classroom } from "@/schemas/classroomSchema";
import { Card, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

type ClassroomsProps = {
  classrooms: Classroom[];
};

export function Classrooms({ classrooms }: ClassroomsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 sm:justify-start">
      {classrooms.map((classroom) => (
        <Card key={classroom.id} className="min-w-72 max-w-72">
          <CardHeader>
            <CardTitle>{classroom.name}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link href={`/classrooms/${classroom.id}`} className="w-full">
              <Button className="flex w-full items-center gap-1">
                View <MagnifyingGlassIcon />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
