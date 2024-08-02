"use client";

import { useUIState } from "ai/rsc";
import { type TypeAI } from "./AiProvider";

export function ChatMessages() {
  const [messages] = useUIState<TypeAI>();

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
