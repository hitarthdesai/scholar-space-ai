import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type SignupForm = z.infer<typeof signupFormSchema>;

export const EnumSignupResult = {
  ExistsAndVerified: "existsAndVerified",
  ExistsNotVerified: "existsNotVerified",
  EmailSent: "registrationEmailSent",
  Error: "error",
} as const;

export const signupResultSchema = z.nativeEnum(EnumSignupResult);

export type SignupResult = z.infer<typeof signupResultSchema>;

export const signupResponseSchema = z.object({
  type: signupResultSchema,
  message: z.string().optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;
