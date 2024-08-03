"use client";

import { useUIState } from "ai/rsc";
import { type TypeAI } from "./AiProvider";
import { Message } from "@/schemas/chatSchema";

type ChatMessageProps = {
  message: Message;
};

function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div>
      {message.role}: {message.content}
    </div>
  );
}

export function ChatMessages() {
  const [messages] = useUIState<TypeAI>();

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
