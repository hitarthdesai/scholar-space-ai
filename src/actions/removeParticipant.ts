"use server";

import {
  removeParticipantInputSchema,
  EnumRemoveParticipantResult,
  EnumClassroomRole,
  EnumClassroomParticpantStatus,
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

      const admins = await db
        .select()
        .from(classroomParticpants)
        .where(
          and(
            eq(classroomParticpants.classroomId, classroomId),
            eq(classroomParticpants.role, EnumClassroomRole.Admin),
            eq(
              classroomParticpants.status,
              EnumClassroomParticpantStatus.Accepted
            )
          )
        );

      if (admins.length === 1 && admins[0].userId === participantId) {
        return { type: EnumRemoveParticipantResult.LastAdmin };
      }

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

      return {
        type: EnumRemoveParticipantResult.ParticpantRemoved,
      };
    } catch (e) {
      console.error(e);
      return { type: EnumRemoveParticipantResult.Error };
    }
  });
