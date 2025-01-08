import { EnumConversationType, type MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import { conversationMessages, messages } from "@/server/db/schema";

export type SaveMessageToDbInput = {
  conversationId: string;
  message: string;
  by: MessageRole;
};

type SaveMessageToDbOutput = {
  conversationId: string;
  messageId: string;
};

export const saveMessageToDb = async ({
  conversationId,
  message,
  by,
}: SaveMessageToDbInput): Promise<SaveMessageToDbOutput> => {
  return db.transaction(async (tx) => {
    const [{ messageId }] = await tx
      .insert(messages)
      .values([{ message, by }])
      .returning({ messageId: messages.id });

    await tx.insert(conversationMessages).values({ conversationId, messageId });

    return { conversationId, messageId };
  });
};
