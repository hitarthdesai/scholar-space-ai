import { AI } from "@/components/AiProvider";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatPromptInput } from "@/components/ChatPromptInput";

export async function Chat() {
  return (
    <AI>
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-full flex-col justify-between py-2 sm:max-w-2xl">
          <ChatMessages />
          <ChatPromptInput />
        </div>
      </div>
    </AI>
  );
}
