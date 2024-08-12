import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LockClosedIcon } from "@radix-ui/react-icons";

export function PageForLoggedInUsersOnly() {
  return (
    <main className="flex h-full w-full flex-col items-center justify-center">
      <LockClosedIcon className="h-24 w-24 text-gray-400" aria-hidden />
      <p className="max-w-48 text-center">
        This page is only available to signed in users
      </p>
      <div className="mt-4 flex gap-1">
        <Link href="/">
          <Button variant="outline">Go to homepage</Button>
        </Link>
        <Link href="/login">
          <Button>Log in now</Button>
        </Link>
      </div>
    </main>
  );
}
