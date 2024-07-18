import Link from "next/link";

import { auth } from "@/utils/auth/config";

async function LoggedOutHeader() {
  const isLoggedIn = Boolean(await auth());
  if (isLoggedIn) return null;

  return (
    <div className="mr-4 flex w-full">
      <Link href="/" className="mr-4 flex grow items-center space-x-2 lg:mr-6">
        <span className="font-bold lg:inline-block">Capstone Project</span>
      </Link>
      <Link href="/signup" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <span className="lg:inline-block">Signup</span>
      </Link>
      <Link href="/signin" className="flex items-center space-x-2">
        <span className="lg:inline-block">Signin</span>
      </Link>
    </div>
  );
}

async function LoggedInHeader() {
  const isLoggedIn = Boolean(await auth());
  if (!isLoggedIn) return null;

  return (
    <div className="mr-4 flex w-full">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <span className="font-bold lg:inline-block">Capstone Project</span>
      </Link>
      <Link href="/" className="mr-4 flex grow items-center space-x-2 lg:mr-6">
        <span className="lg:inline-block">Dashboard</span>
      </Link>
    </div>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <LoggedOutHeader />
        <LoggedInHeader />
      </div>
    </header>
  );
}
