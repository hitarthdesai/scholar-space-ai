import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { auth } from "@/utils/auth/config";
import { getUserFreeConversations } from "@/utils/chat/getUserFreeConversations";

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

  const conversations = await getUserFreeConversations({ userId });

  return (
    <div id="hello" className="relative flex h-full">
      <ConversationsSidebar conversations={conversations} />
      <div className="absolute left-0 top-0 z-10 h-full w-full sm:relative sm:grow">
        {children}
      </div>
    </div>
  );
}
