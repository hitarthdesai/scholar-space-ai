"use server";

import {
  deleteFileFormSchema,
  EnumDeleteFileResult,
} from "@/schemas/fileSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessFile } from "@/utils/classroom/canUserAccessFile";
import { deleteFileFromDb } from "@/utils/classroom/deleteFileFromDb";

export const deleteFile = createSafeActionClient()
  .schema(deleteFileFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumDeleteFileResult.NotAuthorized };
      }

      const { fileId } = parsedInput;
      const isAuthorized = await canUserAccessFile({
        fileId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumDeleteFileResult.NotAuthorized };
      }

      await deleteFileFromDb({ fileId });
      return { type: EnumDeleteFileResult.FileDeleted };
    } catch (e) {
      console.error(e);
      return { type: EnumDeleteFileResult.Error };
    }
  });
