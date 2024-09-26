"use server";

import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
  EnumEditParticipantResult,
  editParticipantFormSchema,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants } from "@/server/db/schema";
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
        return { type: EnumEditParticipantResult.LastAdmin };
      }

      const participant = await db
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

      return {
        type: EnumEditParticipantResult.ParticpantEdited,
      };
    } catch (e) {
      console.error(e);
      return { type: EnumEditParticipantResult.Error };
    }
  });
