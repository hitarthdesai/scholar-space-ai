import Link from "next/link";
import { LinkHighlight } from "./LinkHighlight";
import { type NavLink } from "@/utils/constants/navLinks";

type HeaderLinksProps = {
  navLinks: NavLink[];
};

export function HeaderLinks({ navLinks }: HeaderLinksProps) {
  return (
    <div className="hidden flex-row items-center justify-center gap-4 sm:flex lg:gap-6">
      {navLinks.map((link, index) => (
        <Link key={index} href={link.href} className="relative">
          {link.label}
          <LinkHighlight href={link.href} />
        </Link>
      ))}
    </div>
  );
}
