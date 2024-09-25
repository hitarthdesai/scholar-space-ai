"use server";

import {
  acceptInviteFormSchema,
  EnumClassroomParticpantStatus,
  EnumAcceptInviteResult,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants, users } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const acceptInvite = createSafeActionClient()
  .schema(acceptInviteFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumAcceptInviteResult.NotAuthorized };
      }

      if (!parsedInput.confirm) {
        return { type: EnumAcceptInviteResult.NotConfirmed };
      }

      const invite = await db
        .update(classroomParticpants)
        .set({
          status: EnumClassroomParticpantStatus.Accepted,
        })
        .where(
          and(
            eq(classroomParticpants.classroomId, parsedInput.classroomId),
            eq(classroomParticpants.userId, userId)
          )
        );

      if (invite.rowsAffected === 0) {
        return { type: EnumAcceptInviteResult.NotAuthorized };
      }

      return { type: EnumAcceptInviteResult.InviteAccepted };
    } catch (e) {
      console.error(e);
      return { type: EnumAcceptInviteResult.Error };
    }
  });
