"use client";

// had to create a client component just for the headers
// server side props wouldn't update when changing links and fell
// back to home
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "@/utils/constants/navLinks"; // Import NavLink type

interface ClientHeaderProps {
  navLinks: NavLink[];
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ navLinks }) => {
  const pathname = usePathname(); // Getting the current path

  return (
    <div className="hidden flex-row items-center justify-center gap-4 sm:flex lg:gap-6">
      {navLinks.map((link, index) => {
        const isActive = pathname === link.href; // Checking if the current path matches the link
        return (
          <Link
            key={index}
            href={link.href}
            className={`border-white hover:border-b hover:text-xl ${
              isActive ? "border-b-2 text-blue-500" : ""
              // can change above based on what we want
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};
