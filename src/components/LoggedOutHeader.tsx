import { auth } from "@/utils/auth/config";
import Link from "next/link";

export async function LoggedOutHeader() {
  const isLoggedIn = Boolean(await auth());
  if (isLoggedIn) return null;

  return (
    <div className="container flex h-14 max-w-screen-2xl items-center">
      <Link href="/" className="mr-4 flex grow items-center space-x-2 lg:mr-6">
        <span className="font-bold lg:inline-block">ScholarSpace AI</span>
      </Link>
      <Link href="/login" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <span className="lg:inline-block">Login</span>
      </Link>
    </div>
  );
}
