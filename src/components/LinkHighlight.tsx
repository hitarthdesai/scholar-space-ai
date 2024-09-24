"use client";

import { usePathname } from "next/navigation";

type LinkHighlightProps = {
  href: string;
};

export function LinkHighlight({ href }: LinkHighlightProps) {
  const pathname = usePathname();
  const isCurrentPathname = href === pathname;

  if (!isCurrentPathname) return null;

  return <div className="w-full border-b-2 border-white" />;
}
