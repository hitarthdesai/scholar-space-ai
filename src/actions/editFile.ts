"use server";

import { editFileFormSchema, EnumEditFileResult } from "@/schemas/fileSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessFile } from "@/utils/classroom/canUserAccessFile";
import { updateFileInDb } from "@/utils/classroom/updateFileInDb";

export const editFile = createSafeActionClient()
  .schema(editFileFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditFileResult.NotAuthorized };
      }

      const { fileId, newName } = parsedInput;
      const isAuthorized = await canUserAccessFile({
        fileId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumEditFileResult.NotAuthorized };
      }

      await updateFileInDb({ fileId, name: newName });

      return { type: EnumEditFileResult.FileEdited };
    } catch (e) {
      console.error(e);
      return { type: EnumEditFileResult.Error };
    }
  });
