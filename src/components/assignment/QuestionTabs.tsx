import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EnumTabsContentType, tabsDetails } from "@/utils/constants/question";
import { Chat } from "../Chat";
import { EnumConversationType } from "@/schemas/chatSchema";

type QuestionTabsProps = {
  questionId: string;
};

export function QuestionTabs({ questionId }: QuestionTabsProps) {
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
        <Chat type={EnumConversationType.Question} questionId={questionId} />
      </TabsContent>
      {/* <TabsContent value={tabsDetails[EnumTabsContentType.InputOutput].value}>
        Input/Output here
      </TabsContent> */}
    </Tabs>
  );
}
