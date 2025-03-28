"use client";

import Link from "next/link";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  ClipboardCheck,
} from "lucide-react";
import { EnumClassroomRole } from "@/schemas/classroomSchema";

type ClassroomDashboardGridNavProps = {
  userRole: string;
  classroomId: string;
};

export function ClassroomDashboardGridNav({
  userRole,
  classroomId,
}: ClassroomDashboardGridNavProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Classroom Home Page
        </h1>
      </div>

      {userRole === EnumClassroomRole.Teacher ||
      userRole === EnumClassroomRole.Admin ? (
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/classrooms/${classroomId}/assignments`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-blue-600 p-6 transition-colors hover:bg-blue-700"
          >
            <FileText className="mb-3 h-8 w-8 text-blue-200" />
            <span className="text-center font-medium text-white">
              Assignments
            </span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/participants`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-amber-600 p-6 transition-colors hover:bg-amber-700"
          >
            <Users className="mb-3 h-8 w-8 text-amber-200" />
            <span className="text-center font-medium text-white">
              Participants
            </span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/chat`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-purple-600 p-6 transition-colors hover:bg-purple-700"
          >
            <MessageSquare className="mb-3 h-8 w-8 text-purple-200" />
            <span className="text-center font-medium text-white">Chat</span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/submissions`}
            className="row-span-2 flex flex-col items-center justify-center rounded-lg border border-border bg-rose-600 p-6 transition-colors hover:bg-rose-700"
          >
            <ClipboardCheck className="mb-3 h-8 w-8 text-rose-200" />
            <span className="text-center font-medium text-white">
              Submissions
            </span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/files`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-green-600 p-6 transition-colors hover:bg-green-700"
          >
            <BookOpen className="mb-3 h-8 w-8 text-green-200" />
            <span className="text-center font-medium text-white">Files</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`/classrooms/${classroomId}/assignments`}
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-blue-600 p-6 transition-colors hover:bg-blue-700"
          >
            <FileText className="mb-3 h-8 w-8 text-blue-200" />
            <span className="text-center font-medium text-white">
              Assignments
            </span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/participants`}
            className="flex flex-col items-center justify-center rounded-lg border border-border bg-amber-600 p-6 transition-colors hover:bg-amber-700"
          >
            <Users className="mb-3 h-8 w-8 text-amber-200" />
            <span className="text-center font-medium text-white">
              Participants
            </span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/chat`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-purple-600 p-6 transition-colors hover:bg-purple-700"
          >
            <MessageSquare className="mb-3 h-8 w-8 text-purple-200" />
            <span className="text-center font-medium text-white">Chat</span>
          </Link>

          <Link
            href={`/classrooms/${classroomId}/files`}
            className="flex h-[120px] flex-col items-center justify-center rounded-lg border border-border bg-green-600 p-6 transition-colors hover:bg-green-700"
          >
            <BookOpen className="mb-3 h-8 w-8 text-green-200" />
            <span className="text-center font-medium text-white">Files</span>
          </Link>
        </div>
      )}
    </div>
  );
}
