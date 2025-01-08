"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LinkHighlight } from "../LinkHighlight";
import { type NavLink } from "@/utils/constants/navLinks";

const getClassroomSidebarLinks: (classroomId: string) => NavLink[] = (
  classroomId
) => [
  { label: "Home", href: `/classrooms/${classroomId}` },
  { label: "Assignments", href: `/classrooms/${classroomId}/assignments` },
  { label: "Files", href: `/classrooms/${classroomId}/files` },
  { label: "Chat", href: `/classrooms/${classroomId}/chats` },
  { label: "Participants", href: `/classrooms/${classroomId}/participants` },
];

type ClassroomSidebarProps = {
  classroomId: string;
};

export const ClassroomSidebarContent = ({
  classroomId,
}: ClassroomSidebarProps) => {
  return (
    <aside className="mr-4 mt-2 flex h-full min-w-40 max-w-40 flex-col border-r pl-2">
      <ul className="flex flex-col gap-2">
        {getClassroomSidebarLinks(classroomId).map((link) => (
          <li key={link.href} className="max-w-fit">
            <Link href={link.href}>
              {link.label}
              <LinkHighlight href={link.href} />
            </Link>
          </li>
        ))}
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
