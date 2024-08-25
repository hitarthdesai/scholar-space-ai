import { db } from "@/server/db";
import { conversations } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type DeleteConversationProps = {
  conversationId: string;
};

export async function deleteConversation({
  conversationId,
}: DeleteConversationProps): Promise<boolean> {
  const result = await db
    .delete(conversations)
    .where(eq(conversations.id, conversationId));

  return result.rowsAffected > 0;
}
