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
import { HeaderLinks } from "./HeaderLinks";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { getUserProfileData } from "@/utils/profile/getUserProfileData";

export async function LoggedInHeader() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const userData = await getUserProfileData({ userId });
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
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
      <HeaderLinks navLinks={navLinks} />
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
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="border-r border-muted-foreground/30 pr-2">
          <ThemeSwitcher />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-row items-center justify-center gap-1">
              <div className="grid aspect-square h-6 place-items-center rounded-full bg-red-500 text-xs sm:h-8 sm:text-sm">
                {getInitials(userData.name)}
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
    </div>
  );
}
