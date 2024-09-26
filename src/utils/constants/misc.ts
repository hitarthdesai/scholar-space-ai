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
  [EnumClassroomParticpantStatus.Pending]: "border-yellow-300 text-yellow-300",
  [EnumClassroomParticpantStatus.Invited]: "border-yellow-700 text-yellow-700",
  [EnumClassroomParticpantStatus.Rejected]: "border-red-500 text-red-500",
};
