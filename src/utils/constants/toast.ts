import { EnumSignupResult, type SignupResult } from "@/schemas/formSchema";

export const toastDescriptionSignup: Record<SignupResult, string> = {
  [EnumSignupResult.ExistsAndVerified]: "User with this email already exists.",
  [EnumSignupResult.ExistsNotVerified]:
    "User with this email already exists but is not verified.",
  [EnumSignupResult.EmailSent]: "User registered successfully.",
  [EnumSignupResult.Error]: "Failed to register user.",
};
