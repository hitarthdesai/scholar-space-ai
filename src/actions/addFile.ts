"use server";

import { addFileFormSchema, EnumAddFileResult } from "@/schemas/fileSchema";
import { EnumAccessType } from "@/schemas/dbTableAccessSchema";
import { auth } from "@/utils/auth/config";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";
import { createSafeActionClient } from "next-safe-action";
import { canUserAccessClassroom } from "@/utils/classroom/canUserAccessClassroom";
import { addFileToDb } from "@/utils/classroom/addFileToDb";
import { attachFileToClassroomInDb } from "@/utils/classroom/attachFileToClassroomInDb";

export const addFile = createSafeActionClient()
  .schema(addFileFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAddFileResult.NotAuthorized };
      }

      const { classroomId, file, name } = parsedInput;
      const isAuthorized = await canUserAccessClassroom({
        classroomId,
        userId,
        accessType: EnumAccessType.Write,
      });
      if (!isAuthorized) {
        return { type: EnumAddFileResult.NotAuthorized };
      }

      const newFileId = randomUUID();
      const fileName = `classrooms/${classroomId}/files/${newFileId}`;
      const didFileUploadSucceed = await putObject({
        body: Buffer.from(file, "base64"),
        fileName,
        contentType: "text/plain",
      });
      if (!didFileUploadSucceed) {
        return { type: EnumAddFileResult.NotUploaded };
      }

      await addFileToDb({
        fileId: newFileId,
        userId,
        name,
      });

      await attachFileToClassroomInDb({
        fileId: newFileId,
        classroomId,
      });

      return { type: EnumAddFileResult.FileAdded };
    } catch (e) {
      console.error(e);
      return { type: EnumAddFileResult.Error };
    }
  });
