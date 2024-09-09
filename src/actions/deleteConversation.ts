"use server";

import {
  EnumDeleteConversationResult,
  deleteConversationInputSchema,
} from "@/schemas/chatSchema";
import { auth } from "@/utils/auth/config";
import { deleteConversationFromDb } from "@/utils/chat/deleteConversationFromDb";
import { doesConversationBelongToUser } from "@/utils/chat/doesConversationBelongToUser";
import { createSafeActionClient } from "next-safe-action";

export const deleteConversation = createSafeActionClient()
  .schema(deleteConversationInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumDeleteConversationResult.NotAuthorized };
      }

      const { conversationId } = parsedInput;
      const isUserAuthorizedToViewConversation =
        await doesConversationBelongToUser({ userId, conversationId });

      if (!isUserAuthorizedToViewConversation) {
        return { type: EnumDeleteConversationResult.NotAuthorized };
      }

      await deleteConversationFromDb({
        conversationId,
      });

      return { type: EnumDeleteConversationResult.ConversationDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteConversationResult.Error };
    }
  });
