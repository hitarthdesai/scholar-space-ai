import { auth } from "@/utils/auth/config";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name;
  const displayName = userName ?? "User";

  return (
    <main className="flex w-screen flex-row px-6">
      <div>
        <p className="text-2xl">Hello {displayName}</p>
      </div>
    </main>
  );
}
