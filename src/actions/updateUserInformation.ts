"use server";

import {
  EnumUpdateUserInformationResult,
  updateUserInformationFormSchema,
} from "@/schemas/userSchema";

import { auth } from "@/utils/auth/config";
import { updateUserInformationInDb } from "@/utils/profile/updateUserInformationInDb";
import { createSafeActionClient } from "next-safe-action";
import { putObject } from "@/utils/storage/s3/putObject";

export const updateUserInformation = createSafeActionClient()
  .schema(updateUserInformationFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { userId, newName, userDescription } = parsedInput;

      const session = await auth();
      const sessionUserId = session?.user?.id;
      if (!userId || userId !== sessionUserId) {
        return { type: EnumUpdateUserInformationResult.NotAuthorized };
      }
      console.log("Before db update newName", newName);
      const fileName = `users/${userId}/description`;
      const buffer = Buffer.from(userDescription, "utf-8");
      const didUploadSucceed = await putObject({
        body: buffer,
        fileName,
        contentType: "text/plain",
      });
      if (!didUploadSucceed) {
        return { type: EnumUpdateUserInformationResult.Error };
      }

      await updateUserInformationInDb({
        userId: userId,
        newName: newName,
      });

      return { type: EnumUpdateUserInformationResult.UserInformationUpdated };
    } catch (e) {
      console.error(e);
      return { type: EnumUpdateUserInformationResult.Error };
    }
  });
