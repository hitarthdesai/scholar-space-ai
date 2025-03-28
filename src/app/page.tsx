import { LoggedInSections } from "@/components/LoggedInSections";
import { LoggedOutSections } from "@/components/LoggedOutSections";
import { auth } from "@/utils/auth/config";

export default async function Home() {
  const isLoggedIn = Boolean(await auth());
  return (
    <main className="grid h-full w-full place-items-center">
      {isLoggedIn ? <LoggedInSections /> : <LoggedOutSections />}
    </main>
  );
}
