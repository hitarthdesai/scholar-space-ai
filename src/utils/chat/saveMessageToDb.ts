import { MessageRole } from "@/schemas/chatSchema";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";

type SaveMessageToDbInput = {
  conversationId: string;
  message: string;
  by: MessageRole;
};

export const saveMessageToDb = async ({
  message,
  by,
}: SaveMessageToDbInput): Promise<string> => {
  const [{ messageId }] = await db
    .insert(messages)
    .values([{ message, by }])
    .returning({ messageId: messages.id });

  return messageId;
};
