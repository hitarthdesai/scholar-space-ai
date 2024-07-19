import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().email(),
});

export type LoginForm = z.infer<typeof loginFormSchema>;

export const EnumLoginResult = {
  EmailSent: "registrationEmailSent",
  Error: "error",
} as const;

const authResultSchema = z.nativeEnum(EnumLoginResult);
export type LoginResult = z.infer<typeof authResultSchema>;
