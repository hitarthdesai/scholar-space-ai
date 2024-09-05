"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      variant="destructive"
      onClick={handleSignOut}
      size="sm"
      className="w-full"
    >
      Logout
    </Button>
  );
}
