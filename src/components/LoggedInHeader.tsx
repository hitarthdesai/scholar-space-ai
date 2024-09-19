import { auth } from "@/utils/auth/config";
import Link from "next/link";
import { ChevronDownIcon, GraduationCapIcon } from "lucide-react";
import { navLinks } from "@/utils/constants/navLinks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "./LogoutButton";

export async function LoggedInHeader() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

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
      <div className="hidden flex-row items-center justify-center gap-4 sm:flex lg:gap-6">
        {/* TODO: Highlight active item in here */}
        {navLinks.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className="border-white hover:border-b hover:text-xl"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {/* On small screens i.e. below lg, show another menu whose active item is the current page url, and remaining items are `navLinks` */}
      {/* <div className="flex flex-row items-center justify-center gap-1"> */}
      {/* Contains an avatar showing user's profile photo */}

      {/* Menu contains
            1. View your profile link
            2. Logout button
          */}
      {/* <Link href="/profile">View your profile</Link> */}
      {/* <LogoutButton /> */}
      {/* </div> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="grid aspect-square h-6 place-items-center rounded-full bg-red-500 sm:h-8">
              S
            </div>
            <ChevronDownIcon className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {navLinks.map((link, index) => (
              <DropdownMenuItem key={index}>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
