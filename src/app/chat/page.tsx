import { Chat } from "@/components/Chat";
import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { auth } from "@/utils/auth/config";

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <PageForLoggedInUsersOnly />;
  }

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat />
    </main>
  );
}
