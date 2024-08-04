"use client";

import { useUIState } from "ai/rsc";
import { type TypeAI } from "./AiProvider";
import {
  EnumMessageRole,
  type MessageRole,
  type Message,
} from "@/schemas/chatSchema";
import { cn } from "@/utils/cn";
import { type ReactNode } from "react";
import { MixIcon, PersonIcon } from "@radix-ui/react-icons";

type ChatMessageProps = {
  message: Message;
};

const chatMessageIcons: Record<MessageRole, ReactNode> = {
  [EnumMessageRole.User]: <PersonIcon aria-hidden className="h-6 w-6" />,
  [EnumMessageRole.Assistant]: <MixIcon aria-hidden className="h-6 w-6" />,
};

function ChatMessage({ message: { role, content } }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex items-center",
        role === EnumMessageRole.User ? "justify-end" : "",
        role === EnumMessageRole.Assistant ? "justify-start" : ""
      )}
    >
      <div
        className={cn(
          "flex max-w-xs items-center gap-2",
          role === EnumMessageRole.User ? "flex-row" : "",
          role === EnumMessageRole.Assistant ? "flex-row-reverse" : ""
        )}
      >
        <p className="rounded-lg bg-stone-700 p-2">{content}</p>
        <div className="">{chatMessageIcons[role]}</div>
      </div>
    </div>
  );
}

export function ChatMessages() {
  const [messages] = useUIState<TypeAI>();

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
    </div>
  );
}
