import { db } from "@/server/db";
import { userConversations } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type DoesConversationBelongToUserProps = {
  userId: string;
  conversationId: string;
};

export async function doesConversationBelongToUser({
  userId,
  conversationId,
}: DoesConversationBelongToUserProps): Promise<boolean> {
  const _userConversations = await db
    .select({ id: userConversations.userId })
    .from(userConversations)
    .where(
      and(
        eq(userConversations.userId, userId),
        eq(userConversations.conversationId, conversationId)
      )
    );

  console.log(_userConversations);

  return _userConversations.length > 0;
}
