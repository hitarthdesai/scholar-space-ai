"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { type Conversation } from "@/schemas/chatSchema";
import Link from "next/link";

type ConversationItemProps = {
  conversation: Conversation;
};

type ConversationSidebarProps = {
  conversations: Conversation[];
};

export function ConversationItem({ conversation }: ConversationItemProps) {
  return (
    <div
      key={conversation.id}
      className="overflow-hidden text-ellipsis py-2 pl-4 hover:bg-stone-800"
    >
      <Link href={`/chat/${conversation.id}`} className="text-nowrap">
        {conversation.id}
      </Link>
    </div>
  );
}

export function ConversationsSidebar({
  conversations,
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "z-20 h-full translate-x-0 border-r-4 bg-stone-900 transition-[width] duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="absolute left-0 top-0 z-20 ml-2 mt-2 flex items-center justify-center gap-4">
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-8 w-8 rounded-md"
          variant="outline"
          size="icon"
          name="Toggle conversations sidebar"
        >
          <ChevronLeftIcon
            className={cn(
              "h-4 w-4 transition-transform duration-700 ease-in-out",
              isOpen === false ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
        {isOpen && (
          <Button className="grow overflow-hidden text-ellipsis">
            <Link href="/chat" className="flex items-center gap-2 text-nowrap">
              <p>New conversation</p>
              <Pencil1Icon />
            </Link>
          </Button>
        )}
      </div>
      {isOpen && (
        <div className="pt-14">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      )}
    </aside>
  );
}
