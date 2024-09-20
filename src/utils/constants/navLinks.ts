export type NavLink = {
  // had to export type to use across files
  href: string;
  label: string;
};

export const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/chat",
    label: "Chat",
  },
  {
    href: "/classrooms",
    label: "Classrooms",
  },
];
