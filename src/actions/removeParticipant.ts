"use server";

import {
  removeParticipantInputSchema,
  EnumRemoveParticipantResult,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { canUserManageParticipants } from "@/utils/classroom/canUserManageParticipants";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const removeParticipant = createSafeActionClient()
  .schema(removeParticipantInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumRemoveParticipantResult.NotAuthorized };
      }

      const { classroomId, participantId } = parsedInput;
      const isAuthorized = await canUserManageParticipants({
        classroomId,
        userId,
      });
      if (!isAuthorized) {
        return { type: EnumRemoveParticipantResult.NotAuthorized };
      }

      return await db.transaction(async (tx) => {
        const participant = await db
          .delete(classroomParticpants)
          .where(
            and(
              eq(classroomParticpants.classroomId, classroomId),
              eq(classroomParticpants.userId, participantId)
            )
          );

        if (participant.rowsAffected === 0) {
          return { type: EnumRemoveParticipantResult.NotAParticipant };
        }

        const admins = await tx
          .select()
          .from(classroomParticpants)
          .where(
            and(
              eq(classroomParticpants.classroomId, classroomId),
              eq(classroomParticpants.role, EnumClassroomRole.Admin)
            )
          );

        if (admins.length === 0) {
          tx.rollback();
          return { type: EnumRemoveParticipantResult.LastAdmin };
        }

        return {
          type: EnumRemoveParticipantResult.ParticpantRemoved,
        };
      });
    } catch (e) {
      console.error(e);
      return { type: EnumRemoveParticipantResult.Error };
    }
  });
