"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type ClassroomSidebarProps = {
  classroomId: string;
};

export const ClassroomSidebarContent = ({
  classroomId,
}: ClassroomSidebarProps) => {
  return (
    <aside className="flex h-full min-w-40 max-w-40 flex-col border-r">
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen ? (
        <Button
          variant="ghost"
          size="icon"
          className="mt-0.5"
          onClick={() => setIsOpen(true)}
        >
          <MenuIcon className="h-4 w-4" />
        </Button>
      ) : (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="mt-0.5 p-0"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
          <ClassroomSidebarContent classroomId={classroomId} />
        </>
      )}
    </>
  );
};
