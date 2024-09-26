"use server";

import {
  rejectInviteFormSchema,
  EnumClassroomParticpantStatus,
  EnumRejectInviteResult,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const rejectInvite = createSafeActionClient()
  .schema(rejectInviteFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumRejectInviteResult.NotAuthorized };
      }
      if (!parsedInput.confirm) {
        return { type: EnumRejectInviteResult.NotConfirmed };
      }
      const invite = await db
        .update(classroomParticpants)
        .set({
          status: EnumClassroomParticpantStatus.Rejected,
        })
        .where(
          and(
            eq(classroomParticpants.classroomId, parsedInput.classroomId),
            eq(classroomParticpants.userId, userId)
          )
        );

      if (invite.rowsAffected === 0) {
        return { type: EnumRejectInviteResult.NotAuthorized };
      }

      return { type: EnumRejectInviteResult.InviteRejected };
    } catch (e) {
      console.error(e);
      return { type: EnumRejectInviteResult.Error };
    }
  });
