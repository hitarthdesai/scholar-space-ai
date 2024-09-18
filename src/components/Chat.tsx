import { AI } from "@/components/AiProvider";
import { ChatMessages } from "@/components/ChatMessages";
import {
  ChatPromptInput,
  type ChatPromptInputProps,
} from "@/components/ChatPromptInput";
import { type Message } from "@/schemas/chatSchema";

type ChatProps = ChatPromptInputProps & {
  messages?: Message[];
};

export function Chat({ messages, ...props }: ChatProps) {
  return (
    <AI initialAIState={messages ?? []} initialUIState={messages ?? []}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mx-auto flex w-full max-w-2xl flex-col">
            <ChatMessages />
          </div>
        </div>
        <div className="bottom-0 mx-auto w-full max-w-2xl items-center justify-center bg-background p-2">
          <div className="w-full max-w-2xl justify-center">
            <ChatPromptInput {...props} />
          </div>
        </div>
      </div>
    </AI>
  );
}
