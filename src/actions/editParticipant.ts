"use server";

import {
  EnumClassroomRole,
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

      const { classroomId, participantId, role } = parsedInput;
      const isAuthorized = await canUserManageParticipants({
        classroomId,
        userId,
      });
      if (!isAuthorized) {
        return { type: EnumEditParticipantResult.NotAuthorized };
      }

      return await db.transaction(async (tx) => {
        const participant = await tx
          .update(classroomParticpants)
          .set({
            role,
          })
          .where(
            and(
              eq(classroomParticpants.classroomId, classroomId),
              eq(classroomParticpants.userId, participantId)
            )
          );

        if (participant.rowsAffected === 0) {
          return { type: EnumEditParticipantResult.NotAParticipant };
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
          return { type: EnumEditParticipantResult.LastAdmin };
        }

        return {
          type: EnumEditParticipantResult.ParticpantEdited,
        };
      });
    } catch (e) {
      console.error(e);
      return { type: EnumEditParticipantResult.Error };
    }
  });
