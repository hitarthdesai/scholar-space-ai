import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { EnumConversationType } from "@/schemas/chatSchema";
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
    <div
      className="relative flex"
      style={{ height: "calc(100vh - 56px)" }} // 56px is the height of the header. Need to offset that
    >
      <ConversationsSidebar
        type={EnumConversationType.Free}
        conversations={conversations}
      />
      <div className="absolute left-0 top-0 z-10 h-full w-full sm:relative sm:grow">
        {children}
      </div>
    </div>
  );
}
