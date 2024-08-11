import { Chat } from "@/components/Chat";
import { PageForLoggedInUsersOnly } from "@/components/PageForLoggedInUsersOnly";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { auth } from "@/utils/auth/config";
import { doesConversationBelongToUser } from "@/utils/chat/doesConversationBelongToUser";
import { getConversationMessages } from "@/utils/chat/getConversationMessages";

type RouteParams = {
  id: string;
};

export default async function ChatPage({
  params: { id: conversationId },
}: {
  params: RouteParams;
}) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <PageForLoggedInUsersOnly />;
  }

  const isUserAuthorizedToViewConversation = await doesConversationBelongToUser(
    { userId, conversationId }
  );
  if (!isUserAuthorizedToViewConversation) {
    return <NotAuthorizedToViewPage />;
  }

  const messages = await getConversationMessages({ conversationId });

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat conversationId={conversationId} messages={messages} />
    </main>
  );
}
