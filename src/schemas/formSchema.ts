import { z } from "zod";

export const signupFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type SignupForm = z.infer<typeof signupFormSchema>;

export const signinFormSchema = z.object({
  email: z.string().email(),
});

export type SigninForm = z.infer<typeof signinFormSchema>;

export const EnumAuthResult = {
  EmailSent: "registrationEmailSent",
  Error: "error",
} as const;

export const authResultSchema = z.nativeEnum(EnumAuthResult);

export type AuthResult = z.infer<typeof authResultSchema>;
