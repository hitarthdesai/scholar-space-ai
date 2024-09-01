import { auth } from "@/utils/auth/config";

export default async function Home() {
  const isLoggedIn = Boolean(await auth());

  return (
    <main className="grid h-full w-full place-items-center">
      {isLoggedIn ? "Logged-in User Content" : "Logged-out User Content"}
    </main>
  );
}
