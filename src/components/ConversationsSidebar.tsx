"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Conversation } from "@/schemas/chatSchema";
import Link from "next/link";

type ConversationSidebarProps = {
  conversations: Conversation[];
};

export function ConversationsSidebar({
  conversations,
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "z-20 h-screen -translate-x-full border-r-4 transition-[width] duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="invisible absolute left-0 top-0 z-20 ml-2 mt-2 flex items-center justify-center gap-4 lg:visible">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-8 w-8 rounded-md"
          variant="outline"
          size="icon"
        >
          <ChevronLeftIcon
            className={cn(
              "h-4 w-4 transition-transform duration-700 ease-in-out",
              isOpen === false ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
        {isOpen && <div>Your conversations</div>}
      </div>
      {isOpen && (
        <div className="pt-14">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="overflow-hidden text-ellipsis py-2 pl-4 hover:bg-stone-800"
            >
              <Link href={`/chat/${conversation.id}`} className="text-nowrap">
                {conversation.id}
              </Link>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
