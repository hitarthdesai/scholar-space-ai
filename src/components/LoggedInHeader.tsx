import { auth } from "@/utils/auth/config";
import Link from "next/link";
import { LogoutButton } from "./LogoutButton";

export async function LoggedInHeader() {
  const isLoggedIn = Boolean(await auth());
  if (!isLoggedIn) return null;

  return (
    <div className="container flex h-14 max-w-screen-2xl items-center">
      <div className="min-w-fit">
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <span className="font-bold">ScholarSpace AI</span>
        </Link>
      </div>
      {/* TODO: Bring back nav menu on mobile screens */}
      <div className="hidden w-full grow flex-col justify-between sm:flex sm:flex-row">
        <div className="flex flex-col sm:flex-row">
          <Link
            href="/dashboard"
            className="mr-4 flex items-center space-x-2 lg:mr-6"
          >
            <span>Dashboard</span>
          </Link>
          <Link
            href="/practice"
            className="mr-4 flex items-center space-x-2 lg:mr-6"
          >
            <span>Practice</span>
          </Link>
          <Link
            href="/chat"
            className="mr-4 flex items-center space-x-2 lg:mr-6"
          >
            <span>Ask a Question</span>
          </Link>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
