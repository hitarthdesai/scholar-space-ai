"use server";

import { EnumLoginResult, loginFormSchema } from "@/schemas/formSchema";
import { signIn } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const login = createSafeActionClient()
  .schema(loginFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      // There is some problem with the the workspace/user TS version
      // that causes TS to not recognize the type of parsedInput
      // TODO: Fix this TS issue so that parsedInput has proper typing
      const { email } = parsedInput;

      /**
       * Sometimes signIn logs an error to the console silently.
       * We may want to throw an error manually for these cases.
       * May need to figure out how to intercept console.error?
       */
      const _redirectUrl = await signIn("resend", {
        email,
        redirect: false,
      });

      /**
       * Ensure we have a valid redirect url
       * Otherwise, throw an error
       */
      const redirectUrl = z.string().url().parse(_redirectUrl);

      const isErroneous = new URL(redirectUrl).pathname === "/api/auth/error";
      if (isErroneous) {
        return { type: EnumLoginResult.Error };
      }

      return { type: EnumLoginResult.EmailSent };
    } catch (e) {
      console.error(e);
      return { type: EnumLoginResult.Error };
    }
  });
