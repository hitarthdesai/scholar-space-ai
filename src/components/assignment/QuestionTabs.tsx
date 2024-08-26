import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EnumTabsContentType, tabsDetails } from "@/utils/constants/question";
import { Chat } from "../Chat";
import { EnumConversationType } from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { getQuestionChatFromDb } from "@/utils/chat/getQuestionChatFromDb";

type QuestionTabsProps = {
  questionId: string;
};

export async function QuestionTabs({ questionId }: QuestionTabsProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this chat");

  const messages = await getQuestionChatFromDb({ userId, questionId });

  return (
    <Tabs
      defaultValue={tabsDetails[EnumTabsContentType.Chat].value}
      className="flex h-full w-full flex-col"
    >
      {/* <TabsList className="flex w-full">
        {Object.entries(tabsDetails).map(([key, { label, value }]) => (
          <TabsTrigger key={key} value={value} className="grow">
            {label}
          </TabsTrigger>
        ))}
      </TabsList> */}
      <TabsContent
        value={tabsDetails[EnumTabsContentType.Chat].value}
        className="h-full w-full grow"
      >
        <Chat
          type={EnumConversationType.Question}
          questionId={questionId}
          messages={messages}
        />
      </TabsContent>
      {/* <TabsContent value={tabsDetails[EnumTabsContentType.InputOutput].value}>
        Input/Output here
      </TabsContent> */}
    </Tabs>
  );
}
