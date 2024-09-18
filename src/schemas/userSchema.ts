import {
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from "@/utils/constants/user";
import { z } from "zod";

export const updateUserInformationFormSchema = z.object({
  userId: z.string().min(1),
  newName: z.string().min(USER_NAME_MIN_LENGTH).max(USER_NAME_MAX_LENGTH),
  userDescription: z.string(),
  email: z.string().email(),
});

export type UpdateUserInformationForm = z.infer<
  typeof updateUserInformationFormSchema
>;

export const EnumUpdateUserInformationResult = {
  UserInformationUpdated: "userInformationUpdated",
  NotAuthorized: "notAuthorized",
  Error: "error",
} as const;

const updateUserInformationResultSchema = z.nativeEnum(
  EnumUpdateUserInformationResult
);
export type UpdateUserInformationResult = z.infer<
  typeof updateUserInformationResultSchema
>;
