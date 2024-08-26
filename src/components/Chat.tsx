import { AI } from "@/components/AiProvider";
import { ChatMessages } from "@/components/ChatMessages";
import { ChatPromptInput } from "@/components/ChatPromptInput";
import {
  type ConversationType as ChatType,
  type Message,
  EnumConversationType,
} from "@/schemas/chatSchema";

type ChatProps<T> = T extends "free"
  ? {
      conversationId?: string;
      messages?: Message[];
      type: "free";
    }
  : {
      conversationId?: string;
      messages?: Message[];
      type: "ques";
      questionId: string;
    };

export function Chat(props: ChatProps<ChatType>) {
  return (
    <AI
      initialAIState={props.messages ?? []}
      initialUIState={props.messages ?? []}
    >
      <div className="flex h-full w-full justify-center">
        <div className="flex h-full w-full max-w-full flex-col justify-between p-2 pb-0 sm:max-w-2xl">
          <ChatMessages />
          <ChatPromptInput
            type={props.type}
            conversationId={props.conversationId}
            questionId={
              props.type === EnumConversationType.Free
                ? undefined
                : props.questionId
            }
          />
        </div>
      </div>
    </AI>
  );
}
