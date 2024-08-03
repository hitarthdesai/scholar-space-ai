import { MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import {
  conversationMessages,
  conversations,
  messages,
} from "@/server/db/schema";

type SaveMessageToDbInput = {
  /** if undefined, generate a new conversationId */
  conversationId?: string;
  message: string;
  by: MessageRole;
};

type SaveMessageToDbOutput = {
  conversationId: string;
  messageId: string;
};

export const saveMessageToDb = async ({
  message,
  by,
  conversationId: convId,
}: SaveMessageToDbInput): Promise<SaveMessageToDbOutput> => {
  return db.transaction(async (tx) => {
    // use the provided conversationId or create a new one
    const conversationId =
      convId ??
      (
        await tx
          .insert(conversations)
          .values({})
          .returning({ id: conversations.id })
      )[0].id;

    const [{ messageId }] = await tx
      .insert(messages)
      .values([{ message, by }])
      .returning({ messageId: messages.id });

    await tx.insert(conversationMessages).values({ conversationId, messageId });

    return { conversationId, messageId };
  });
};
