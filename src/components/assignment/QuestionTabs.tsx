import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EnumTabsContentType, tabsDetails } from "@/utils/constants/question";
import { Chat } from "../Chat";

export function QuestionTabs() {
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
        <Chat />
      </TabsContent>
      {/* <TabsContent value={tabsDetails[EnumTabsContentType.InputOutput].value}>
        Input/Output here
      </TabsContent> */}
    </Tabs>
  );
}
