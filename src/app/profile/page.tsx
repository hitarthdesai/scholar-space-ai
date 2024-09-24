import Profile from "@/components/profile/Profile";
import { auth } from "@/utils/auth/config";
import assert from "assert";

export default async function ProfilePage() {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  assert(!!sessionUserId, "User must be logged in to view this page");
  return (
    <main className="flex h-full flex-col justify-between p-4">
      <Profile userId={sessionUserId} />
    </main>
  );
}
