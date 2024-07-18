import { EnumAuthResult, type AuthResult } from "@/schemas/formSchema";

export const toastDescriptionAuth: Record<AuthResult, string> = {
  [EnumAuthResult.EmailSent]: "User registered successfully.",
  [EnumAuthResult.Error]: "Failed to register user.",
};
