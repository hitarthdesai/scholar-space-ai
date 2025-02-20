import {
  type ClassroomParticipantStatus,
  type ClassroomRole,
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import { type ReactNode } from "react";

import { Code2Icon, ListCheckIcon, ListChecksIcon } from "lucide-react";

export const roleBadgeStyles: Record<ClassroomRole, string> = {
  [EnumClassroomRole.Admin]: "bg-red-500 text-white",
  [EnumClassroomRole.Student]: "bg-blue-500 text-white",
  [EnumClassroomRole.Teacher]: "bg-green-500",
  [EnumClassroomRole.TeachingAssistant]: "bg-yellow-500",
};

export const statusBadgeStyles: Record<ClassroomParticipantStatus, string> = {
  [EnumClassroomParticpantStatus.Accepted]: "border-green-500 text-green-500",
  [EnumClassroomParticpantStatus.Pending]: "border-yellow-300 text-yellow-300",
  [EnumClassroomParticpantStatus.Invited]: "border-yellow-700 text-yellow-700",
  [EnumClassroomParticpantStatus.Rejected]: "border-red-500 text-red-500",
};

type QuestionDisplayConfig = {
  icon: ReactNode;
  label: string;
  badgeStyles: string;
};

export const questionDisplayConfigByType: Record<
  QuestionType,
  QuestionDisplayConfig
> = {
  [EnumQuestionType.Code]: {
    icon: <Code2Icon />,
    label: "Code",
    badgeStyles: "bg-blue-500 text-white",
  },
  [EnumQuestionType.SingleCorrectMcq]: {
    icon: <ListCheckIcon />,
    label: "Single Correct MCQ",
    badgeStyles: "bg-green-500",
  },
  [EnumQuestionType.MultiCorrectMcq]: {
    icon: <ListChecksIcon />,
    label: "Multi Correct MCQ",
    badgeStyles: "bg-yellow-500",
  },
};
