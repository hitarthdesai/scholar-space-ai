import { AI } from "@/components/AiProvider";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatPromptInput } from "@/components/ChatPromptInput";
import { Message } from "@/schemas/chatSchema";

type ChatProps = {
  conversationId?: string;
  messages?: Message[];
};

export async function Chat({ conversationId, messages = [] }: ChatProps) {
  return (
    <AI initialAIState={messages} initialUIState={messages}>
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-full flex-col justify-between py-2 sm:max-w-2xl">
          <ChatMessages />
          <ChatPromptInput conversationId={conversationId} />
        </div>
      </div>
    </AI>
  );
}
