import { type Conversation, conversationSchema } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import { conversations, userConversations } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

type GetUserConversationsProps = {
  userId: string;
};

export async function getUserConversations({
  userId,
}: GetUserConversationsProps): Promise<Conversation[]> {
  const _conversations = await db
    .select({ id: conversations.id, createdAt: conversations.createdAt })
    .from(conversations)
    .innerJoin(
      userConversations,
      eq(conversations.id, userConversations.conversationId)
    )
    .where(eq(userConversations.userId, userId))
    .orderBy(desc(conversations.createdAt));

  return z.array(conversationSchema).parse(_conversations);
}
