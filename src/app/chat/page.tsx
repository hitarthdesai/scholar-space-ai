import { Chat } from "@/components/Chat";
import { EnumConversationType } from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import assert from "assert";

export default async function ChatPage() {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat type={EnumConversationType.Free} />
    </main>
  );
}
