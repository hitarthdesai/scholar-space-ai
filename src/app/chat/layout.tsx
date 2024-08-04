import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { auth } from "@/utils/auth/config";
import { getUserConversations } from "@/utils/chat/getUserConversations";

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <>{children}</>;
  }

  const conversations = await getUserConversations({ userId });

  return (
    <div className="flex h-full">
      <ConversationsSidebar conversations={conversations} />
      <div className="grow">{children}</div>
    </div>
  );
}
