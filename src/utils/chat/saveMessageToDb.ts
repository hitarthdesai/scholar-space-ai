import { type MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import {
  conversationMessages,
  conversations,
  messages,
  userConversations,
} from "@/server/db/schema";
import { auth } from "../auth/config";

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
    let conversationId = "";
    const doesConversationExist = !!convId;
    if (!doesConversationExist) {
      const [{ id }] = await tx
        .insert(conversations)
        .values({})
        .returning({ id: conversations.id });
      conversationId = id;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("User session does not exist");
      }

      await tx.insert(userConversations).values({ conversationId, userId });
    } else {
      conversationId = convId;
    }

    const [{ messageId }] = await tx
      .insert(messages)
      .values([{ message, by }])
      .returning({ messageId: messages.id });

    await tx.insert(conversationMessages).values({ conversationId, messageId });

    return { conversationId, messageId };
  });
};
