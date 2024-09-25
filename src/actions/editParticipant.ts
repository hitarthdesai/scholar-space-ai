"use server";

import {
  EnumClassroomParticpantStatus,
  EnumEditParticipantResult,
  editParticipantFormSchema,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants, users } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { canUserManageParticipants } from "@/utils/classroom/canUserManageParticipants";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const editParticipant = createSafeActionClient()
  .schema(editParticipantFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumEditParticipantResult.NotAuthorized };
      }

      const isAuthorized = await canUserManageParticipants({
        classroomId: parsedInput.classroomId,
        userId,
      });
      if (!isAuthorized) {
        return { type: EnumEditParticipantResult.NotAuthorized };
      }

      const participant = await db
        .update(classroomParticpants)
        .set({
          role: parsedInput.role,
        })
        .where(
          and(
            eq(classroomParticpants.classroomId, parsedInput.classroomId),
            eq(classroomParticpants.userId, parsedInput.participantId)
          )
        );

      if (participant.rowsAffected === 0) {
        return { type: EnumEditParticipantResult.NotAParticipant };
      }

      return {
        type: EnumEditParticipantResult.ParticpantEdited,
      };
    } catch (e) {
      console.error(e);
      return { type: EnumEditParticipantResult.Error };
    }
  });
