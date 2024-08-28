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
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-full flex-col justify-between p-2 pb-0 sm:max-w-2xl">
          <ChatMessages />
          <ChatPromptInput {...props} />
        </div>
      </div>
    </AI>
  );
}
