"use server";

import {
  removeParticipantInputSchema,
  EnumRemoveParticipantResult,
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

      const isAuthorized = await canUserManageParticipants({
        classroomId: parsedInput.classroomId,
        userId,
      });
      if (!isAuthorized) {
        return { type: EnumRemoveParticipantResult.NotAuthorized };
      }

      const participant = await db
        .delete(classroomParticpants)
        .where(
          and(
            eq(classroomParticpants.classroomId, parsedInput.classroomId),
            eq(classroomParticpants.userId, parsedInput.participantId)
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
