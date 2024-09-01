import { EnumRole, type Role } from "@/schemas/userSchema";

type NavLink = {
  href: string;
  label: string;
  visibleTo: Role[];
};

export const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    visibleTo: [EnumRole.Student, EnumRole.Teacher],
  },
  {
    href: "/chat",
    label: "Chat",
    visibleTo: [EnumRole.Student, EnumRole.Teacher],
  },
  {
    href: "/classrooms",
    label: "Classrooms",
    visibleTo: [EnumRole.Student, EnumRole.Teacher],
  },
];
