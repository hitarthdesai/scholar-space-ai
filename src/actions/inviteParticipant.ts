"use server";

import {
  EnumClassroomParticpantStatus,
  EnumInviteParticipantResult,
  inviteParticipantFormSchema,
} from "@/schemas/classroomSchema";
import { db } from "@/server/db";
import { classroomParticpants, users } from "@/server/db/schema";
import { auth } from "@/utils/auth/config";
import { canUserManageParticipants } from "@/utils/classroom/canUserManageParticipants";
import { and, eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";

export const inviteParticipant = createSafeActionClient()
  .schema(inviteParticipantFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        return { type: EnumInviteParticipantResult.NotAuthorized };
      }

      const isAuthorized = await canUserManageParticipants({
        classroomId: parsedInput.classroomId,
        userId,
      });
      if (!isAuthorized) {
        return { type: EnumInviteParticipantResult.NotAuthorized };
      }

      const { classroomId, email, role } = parsedInput;
      const [invitee] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      if (!invitee) {
        return { type: EnumInviteParticipantResult.InviteeNotRegistered };
      }

      const inviteeId = invitee.id;
      const [participant] = await db
        .select({ id: classroomParticpants.userId })
        .from(classroomParticpants)
        .where(
          and(
            eq(classroomParticpants.classroomId, classroomId),
            eq(classroomParticpants.userId, inviteeId)
          )
        );
      if (participant) {
        return { type: EnumInviteParticipantResult.ParticipantAlreadyAdded };
      }

      await db.insert(classroomParticpants).values([
        {
          classroomId,
          userId: inviteeId,
          role,
          status: EnumClassroomParticpantStatus.Invited,
        },
      ]);

      return {
        type: EnumInviteParticipantResult.ParticpantInvited,
      };
    } catch (e) {
      console.error(e);
      return { type: EnumInviteParticipantResult.Error };
    }
  });
