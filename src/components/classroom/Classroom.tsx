import { type Classroom } from "@/schemas/classroomSchema";

type ClassroomProps = {
  classroom: Classroom;
};

export function Classroom({ classroom }: ClassroomProps) {
  return (
    <div>
      <h2>{classroom.name}</h2>
    </div>
  );
}
