import {
  type Conversation,
  conversationSchema,
  EnumConversationType,
} from "@/schemas/chatSchema";
import { db } from "@/server/db";
import { conversations, userConversations } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

type GetUserConversationsProps = {
  userId: string;
};

export async function getUserFreeConversations({
  userId,
}: GetUserConversationsProps): Promise<Conversation[]> {
  const _conversations = await db
    .select({
      id: conversations.id,
      createdAt: conversations.createdAt,
      name: conversations.name,
      type: conversations.type,
    })
    .from(conversations)
    .innerJoin(
      userConversations,
      eq(conversations.id, userConversations.conversationId)
    )
    .where(
      and(
        eq(userConversations.userId, userId),
        eq(conversations.type, EnumConversationType.Free)
      )
    )
    .orderBy(desc(conversations.createdAt));

  return z.array(conversationSchema).parse(_conversations);
}
