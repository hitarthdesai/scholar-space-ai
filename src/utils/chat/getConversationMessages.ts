import { type Message, messageSchema } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import { conversationMessages, messages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

type GetConversationMessagesPrpos = {
  conversationId: string;
};

export async function getConversationMessages({
  conversationId,
}: GetConversationMessagesPrpos): Promise<Message[]> {
  const _messages = await db
    .select({ id: messages.id, content: messages.message, role: messages.by })
    .from(messages)
    .innerJoin(
      conversationMessages,
      eq(conversationMessages.conversationId, conversationId)
    )
    .where(eq(messages.id, conversationMessages.messageId))
    .orderBy(messages.createdAt);

  return z.array(messageSchema).parse(_messages);
}
