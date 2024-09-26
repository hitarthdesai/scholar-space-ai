import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";

export const roleBadgeStyles = {
  [EnumClassroomRole.Admin]: "bg-red-500 text-white",
  [EnumClassroomRole.Student]: "bg-blue-500 text-white",
  [EnumClassroomRole.Teacher]: "bg-green-500",
  [EnumClassroomRole.TeachingAssistant]: "bg-yellow-500",
};

export const statusBadgeStyles = {
  [EnumClassroomParticpantStatus.Accepted]: "border-green-500 text-green-500",
  [EnumClassroomParticpantStatus.Pending]: "border-yellow-500 text-yellow-500",
  [EnumClassroomParticpantStatus.Invited]: "border-red-500 text-red-500",
};
