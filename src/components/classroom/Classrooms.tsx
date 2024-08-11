import { type Classroom } from "@/schemas/classroomSchema";

type ClassroomsProps = {
  classrooms: Classroom[];
};

export function Classrooms({ classrooms }: ClassroomsProps) {
  return (
    <div>
      {classrooms.map((classroom) => (
        <div key={classroom.id}>
          <h2>{classroom.name}</h2>
        </div>
      ))}
    </div>
  );
}
