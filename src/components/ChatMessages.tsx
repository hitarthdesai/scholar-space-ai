"use client";

import { useUIState } from "ai/rsc";
import { type AI } from "./AiProvider";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessages() {
  const [messages] = useUIState<typeof AI>();

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            {message.role}: {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}
