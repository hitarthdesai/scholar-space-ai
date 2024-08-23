"use server";

import {
  EnumRenameConversationResult,
  renameConversationFormSchema,
} from "@/schemas/chatSchema";
import { doesConversationBelongToUser } from "@/utils/chat/doesConversationBelongToUser";
import { auth } from "@/utils/auth/config";
import { updateConversationName } from "@/utils/chat/updateConversationName";
import { createSafeActionClient } from "next-safe-action";

export const renameConversation = createSafeActionClient()
  .schema(renameConversationFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { conversationId, newName } = parsedInput;

      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumRenameConversationResult.NotAuthorized };
      }
      const isUserAuthorizedToViewConversation =
        await doesConversationBelongToUser({ userId, conversationId });

      if (!isUserAuthorizedToViewConversation) {
        return { type: EnumRenameConversationResult.NotAuthorized };
      }

      await updateConversationName({
        conversationId: conversationId,
        newName: newName,
      });

      return { type: EnumRenameConversationResult.ConversationRenamed };
    } catch (e) {
      console.error(e);
      return { type: EnumRenameConversationResult.Error };
    }
  });
