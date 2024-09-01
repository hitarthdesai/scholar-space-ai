import { auth } from "@/utils/auth/config";
import Link from "next/link";
import { ChevronDownIcon, GraduationCapIcon } from "lucide-react";
import { navLinks } from "@/utils/constants/navLinks";

export async function LoggedInHeader() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role) return null;

  const linksToDisplay = navLinks.filter((link) =>
    link.visibleTo.includes(role)
  );

  return (
    <div className="flex h-14 w-full items-center justify-between px-4 sm:px-8">
      <div>
        <Link href="/" className="flex items-center">
          <span className="hidden font-bold sm:block">ScholarSpace AI</span>
          <span className="block font-bold sm:hidden">
            <GraduationCapIcon />
          </span>
        </Link>
      </div>
      {/* TODO: Bring back nav menu on mobile screens */}
      <div className="group hidden flex-row items-center justify-center gap-4 lg:flex lg:gap-6">
        {/* TODO: Highlight active item in here */}
        {linksToDisplay.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="border-white hover:border-b hover:text-xl"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* On small screens i.e. below lg, show another menu whose active item is the current page url, and remaining items are `linksToDisplay` */}
      <div className="flex flex-row items-center justify-center gap-1">
        {/* Contains an avatar showing user's profile photo */}
        <div className="grid aspect-square h-6 place-items-center rounded-full bg-red-500 sm:h-8">
          S
        </div>
        {/* Contains a chevron icon that opens a menu when clicked on */}
        <ChevronDownIcon className="h-4 w-4" />
        {/* Menu contains
            1. View your profile link
            2. Logout button
          */}
        {/* <Link href="/profile">View your profile</Link> */}
        {/* <LogoutButton /> */}
      </div>
    </div>
  );
}
