"use server";

import { EnumSignupResult, signupFormSchema } from "@/schemas/formSchema";
import { signIn } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const signup = createSafeActionClient()
  .schema(signupFormSchema)
  .action(async ({ parsedInput: form }) => {
    try {
      const _redirectUrl = await signIn("resend", {
        name: form.name,
        email: "hitarthdesai306@gmail.com",
        redirect: false,
      });

      /**
       * Ensure we have a valid redirect url
       * Otherwise, throw an error
       */
      z.string().parse(_redirectUrl);

      return { type: EnumSignupResult.EmailSent };
    } catch (e) {
      console.error(e);
      return { type: EnumSignupResult.Error };
    }
  });
