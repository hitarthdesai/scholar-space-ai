"use server";

import { EnumLoginResult, loginFormSchema } from "@/schemas/formSchema";
import { signIn } from "@/utils/auth/config";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const login = createSafeActionClient()
  .schema(loginFormSchema)
  .action(async () => {
    try {
      const _redirectUrl = await signIn("resend", {
        // TODO: Replace this with actual email once done with email tests
        email: "hitarthdesai306@gmail.com",
        redirect: false,
      });

      /**
       * Ensure we have a valid redirect url
       * Otherwise, throw an error
       */
      z.string().parse(_redirectUrl);

      return { type: EnumLoginResult.EmailSent };
    } catch (e) {
      console.error(e);
      return { type: EnumLoginResult.Error };
    }
  });
