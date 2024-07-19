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
          <span className="font-bold lg:inline-block">ScholarSpace AI</span>
        </Link>
      </div>
      <div className="flex w-full grow justify-between">
        <div className="flex">
          <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
            <span className="lg:inline-block">Dashboard</span>
          </Link>
          <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
            <span className="lg:inline-block">Ask a Question</span>
          </Link>
          <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
            <span className="lg:inline-block">Practice</span>
          </Link>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
