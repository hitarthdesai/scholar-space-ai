import { ConversationsSidebar } from "@/components/ConversationsSidebar";
import { PageBreadcrumbs } from "@/components/PageBreadcrumbs";
import { EnumConversationType } from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import { getBreadcrumbsByPage } from "@/utils/breadcrumbs/getBreadcrumbsByPage";
import { getUserFreeConversations } from "@/utils/chat/getUserFreeConversations";
import { EnumPage } from "@/utils/constants/page";

export default async function ChatLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { classroomId: string };
}>) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <>{children}</>;
  }

  const breadcrumbs = await getBreadcrumbsByPage({
    page: EnumPage.ClassroomChats,
    classroomId: params.classroomId,
  });

  const conversations = await getUserFreeConversations({ userId });

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <div className="relative flex h-full w-full">
        <ConversationsSidebar
          type={EnumConversationType.Classroom}
          conversations={conversations}
          classroomId={params.classroomId}
        />
        <div className="absolute left-0 top-0 z-10 h-full w-full sm:relative sm:grow">
          {children}
        </div>
      </div>
    </div>
  );
}
