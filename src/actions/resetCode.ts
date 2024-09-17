"use server";

import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import {
  EnumResetCodeResult,
  resetCodeInputSchema,
} from "@/schemas/questionSchema";
import { auth } from "@/utils/auth/config";
import { canUserAccessQuestion } from "@/utils/classroom/canUserAccessQuestion";
import { getObject } from "@/utils/storage/s3/getObject";
import { createSafeActionClient } from "next-safe-action";

export const resetCode = createSafeActionClient()
  .schema(resetCodeInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumResetCodeResult.NotAuthorized };
      }

      const { questionId } = parsedInput;
      const isAuthorized = await canUserAccessQuestion({
        questionId,
        userId,
        accessType: EnumAccessType.Read,
      });

      if (!isAuthorized) {
        return { type: EnumResetCodeResult.NotAuthorized };
      }

      const starterCode = await getObject({
        fileName: `questions/${questionId}/starterCode.txt`,
      });

      return { type: EnumResetCodeResult.CodeReset, code: starterCode };
    } catch (e) {
      console.error(e);
      return { type: EnumResetCodeResult.Error };
    }
  });
