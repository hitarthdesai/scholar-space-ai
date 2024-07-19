import { EnumLoginResult, type LoginResult } from "@/schemas/formSchema";

export const toastDescriptionAuth: Record<LoginResult, string> = {
  [EnumLoginResult.EmailSent]: "User registered successfully.",
  [EnumLoginResult.Error]: "Failed to register user.",
};
