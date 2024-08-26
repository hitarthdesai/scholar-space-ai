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
      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { conversationId } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumDeleteConversationResult.NotAuthorized };
      }
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
