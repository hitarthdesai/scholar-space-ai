"use client";

import { usePathname } from "next/navigation";

type LinkHighlightProps = {
  href: string;
};

export function LinkHighlight({ href }: LinkHighlightProps) {
  const pathname = usePathname();
  const isCurrentPathname = href === pathname;

  return (
    <div className="w-full">
      {isCurrentPathname ? (
        <span
          className={`block border-b-2 ${
            isCurrentPathname ? "border-white" : "border-transparent"
          }`}
        ></span>
      ) : (
        <></>
      )}
    </div>
  );
}
