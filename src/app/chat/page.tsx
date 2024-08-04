import { Chat } from "@/components/Chat";
import { ChatForLoggedInUsersOnly } from "@/components/ChatForLoggedInUsersOnly";
import { auth } from "@/utils/auth/config";

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <ChatForLoggedInUsersOnly />;
  }

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat />
    </main>
  );
}
