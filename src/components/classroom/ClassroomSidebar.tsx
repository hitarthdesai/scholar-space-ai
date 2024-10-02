import { XIcon } from "lucide-react";
import Link from "next/link";

type ClassroomSidebarProps = {
  classroomId: string;
};

export const ClassroomSidebarContent = ({
  classroomId,
}: ClassroomSidebarProps) => {
  return (
    <aside className="flex h-full min-w-56 max-w-56 flex-col">
      <div className="flex items-center gap-2">
        <XIcon className="invisible m-1 h-4 w-4" />
      </div>
      <ul className="flex flex-col gap-2">
        <li>
          <Link href={`/classrooms/${classroomId}`}>Home</Link>
        </li>
        <li>
          <Link href={`/classrooms/${classroomId}/assignments`}>
            Assignments
          </Link>
        </li>
        <li>
          <Link href={`/classrooms/${classroomId}/participants`}>
            Participants
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export const ClassroomSidebar = ({ classroomId }: ClassroomSidebarProps) => {
  return (
    <>
      {/* <MenuIcon className="m-0.5 h-4 w-4" /> */}
      <ClassroomSidebarContent classroomId={classroomId} />
    </>
  );
};
