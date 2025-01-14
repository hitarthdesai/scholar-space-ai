import { Chat } from "@/components/chat/Chat";
import { NotAuthorizedToViewPage } from "@/components/NotAuthorizedToViewPage";
import { EnumConversationType } from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import { doesConversationBelongToUser } from "@/utils/chat/doesConversationBelongToUser";
import { getConversationMessages } from "@/utils/chat/getConversationMessages";
import assert from "assert";

type PageProps = {
  params: {
    classroomId: string;
    id: string;
  };
};

export default async function ChatPage({
  params: { classroomId, id: conversationId },
}: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const isUserAuthorizedToViewConversation = await doesConversationBelongToUser(
    { userId, conversationId }
  );
  if (!isUserAuthorizedToViewConversation) {
    return <NotAuthorizedToViewPage />;
  }

  const messages = await getConversationMessages({ conversationId });

  return (
    <main className="flex h-full flex-col justify-between">
      <Chat
        type={EnumConversationType.Classroom}
        classroomId={classroomId}
        conversationId={conversationId}
        messages={messages}
        showFilesSelectButton
      />
    </main>
  );
}
