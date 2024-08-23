import { db } from "@/server/db";
import { conversations } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateConversationNameProps = {
  conversationId: string;
  newName: string;
};

export async function updateConversationName({
  conversationId,
  newName,
}: UpdateConversationNameProps): Promise<boolean> {
  const result = await db
    .update(conversations)
    .set({ name: newName })
    .where(eq(conversations.id, conversationId));

  return result.rows.length > 0;
}
