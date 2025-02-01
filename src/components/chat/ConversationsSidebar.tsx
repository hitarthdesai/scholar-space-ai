"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { EnumConversationType, type Conversation } from "@/schemas/chatSchema";
import Link from "next/link";
import { RenameConversationButton } from "./RenameConversationButton";
import { DeleteConversationButton } from "./DeleteConversationButton";

type ConversationItemProps = {
  id: Conversation["id"];
  name: Conversation["name"];
  href: string;
};

function ConversationItem({ id, name, href }: ConversationItemProps) {
  return (
    <div
      key={id}
      className="flex items-center justify-between overflow-hidden text-ellipsis py-2 pl-4 pr-2 hover:bg-stone-800"
    >
      <div className="flex-1 overflow-hidden">
        <Link
          href={href}
          className="block overflow-hidden text-ellipsis whitespace-nowrap"
        >
          {name}
        </Link>
      </div>
      <RenameConversationButton conversationId={id} />
      <DeleteConversationButton conversationId={id} />
    </div>
  );
}

type ConversationSidebarPropsByConversationType =
  | {
      type: typeof EnumConversationType.Free;
    }
  | { type: typeof EnumConversationType.Question }
  | {
      type: typeof EnumConversationType.Classroom;
      classroomId: string;
    };

type ConversationSidebarProps = ConversationSidebarPropsByConversationType & {
  conversations: Conversation[];
};

export function ConversationsSidebar(props: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const newConversationHref =
    props.type === EnumConversationType.Classroom
      ? `/classrooms/${props.classroomId}/chats`
      : "/chat";

  return (
    <aside
      className={cn(
        "z-20 h-full translate-x-0 border-r-4 bg-stone-900 transition-[width] duration-300 ease-in-out",
        isOpen ? "min-w-64 max-w-64" : "min-w-0 max-w-0"
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
            <Link
              href={newConversationHref}
              className="flex items-center gap-2 text-nowrap"
            >
              <p>New conversation</p>
              <Pencil1Icon />
            </Link>
          </Button>
        )}
      </div>
      {isOpen && (
        <div className="h-full max-h-full overflow-y-auto pt-14">
          {props.conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              id={conversation.id}
              name={conversation.name}
              href={
                props.type === EnumConversationType.Classroom
                  ? `/classrooms/${props.classroomId}/chats/${conversation.id}`
                  : `/chat/${conversation.id}`
              }
            />
          ))}
        </div>
      )}
    </aside>
  );
}
