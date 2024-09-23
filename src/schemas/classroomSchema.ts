import {
  CLASSROOM_NAME_MAX_LENGTH,
  CLASSROOM_NAME_MIN_LENGTH,
} from "@/utils/constants/classroom";
import { z } from "zod";
import { EnumFormMode } from "./formSchema";

export const EnumClassroomRole = {
  Admin: "admin",
  Teacher: "teacher",
  TeachingAssistant: "teachingAssistant",
  Student: "student",
} as const;

const classroomRoleSchema = z.nativeEnum(EnumClassroomRole);
export type ClassroomRole = z.infer<typeof classroomRoleSchema>;

export const EnumClassroomParticpantStatus = {
  Accepted: "accepted",
  Pending: "pending",
  Invited: "invited",
} as const;

const classroomParticipantStatusSchema = z.nativeEnum(
  EnumClassroomParticpantStatus
);
export type ClassroomParticipantStatus = z.infer<
  typeof classroomParticipantStatusSchema
>;

export const classroomSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type Classroom = z.infer<typeof classroomSchema>;

export const addEditClassroomSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
    classroom: classroomSchema,
  }),
]);

export type AddEditClassroomSheetProps = z.infer<
  typeof addEditClassroomSheetPropsSchema
>;

export const addClassroomFormSchema = z.object({
  name: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type AddClassroomForm = z.infer<typeof addClassroomFormSchema>;

export const EnumAddClassroomResult = {
  ClassroomAdded: "classroomCreated",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const createClassroomResultSchema = z.nativeEnum(EnumAddClassroomResult);
export type CreateClassroomResult = z.infer<typeof createClassroomResultSchema>;

export const addEditParticipantSheetPropsSchema = z.union([
  z.object({
    mode: z.literal(EnumFormMode.Add),
    classroomId: z.string().min(1),
  }),
  z.object({
    mode: z.literal(EnumFormMode.Edit),
    classroom: classroomSchema,
  }),
]);

export type AddEditParticipantSheetProps = z.infer<
  typeof addEditParticipantSheetPropsSchema
>;

export const inviteParticipantFormSchema = z.object({
  classroomId: z.string().min(1),
  email: z.string().email(),
  role: classroomRoleSchema,
});

export type InviteParticipantForm = z.infer<typeof inviteParticipantFormSchema>;

export const EnumInviteParticipantResult = {
  ParticpantInvited: "participantInvited",
  ParticipantAlreadyAdded: "participantAlreadyAdded",
  InviteeNotRegistered: "inviteeNotRegistered",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const inviteParticipantResultSchema = z.nativeEnum(EnumInviteParticipantResult);
export type InviteParticipantResult = z.infer<
  typeof inviteParticipantResultSchema
>;

export const userClassroomSchema = classroomSchema.extend({
  role: classroomRoleSchema,
  status: classroomParticipantStatusSchema,
});

export type UserClassroom = z.infer<typeof userClassroomSchema>;

export const deleteClassroomInputSchema = z.object({
  classroomId: z.string().min(1),
});

export type DeleteClassroomInput = z.infer<typeof deleteClassroomInputSchema>;

export const EnumDeleteClassroomResult = {
  ClassroomDeleted: "classroomDeleted",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const deleteClassroomResultSchema = z.nativeEnum(EnumDeleteClassroomResult);
export type DeleteClassroomResult = z.infer<typeof deleteClassroomResultSchema>;

export const editClassroomFormSchema = z.object({
  classroomId: z.string().min(1),
  newName: z
    .string()
    .min(CLASSROOM_NAME_MIN_LENGTH)
    .max(CLASSROOM_NAME_MAX_LENGTH),
});

export type EditClassroomForm = z.infer<typeof editClassroomFormSchema>;

export const EnumEditClassroomResult = {
  ClassroomEdited: "classroomEdited",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const editClassroomResultSchema = z.nativeEnum(EnumEditClassroomResult);
export type EditClassroomResult = z.infer<typeof editClassroomResultSchema>;

export const filterClassroomsFormSchema = z.object({
  query: z.string().optional(),
  role: classroomRoleSchema.optional(),
  status: classroomParticipantStatusSchema.optional(),
});

export type FilterClassroomsForm = z.infer<typeof filterClassroomsFormSchema>;
