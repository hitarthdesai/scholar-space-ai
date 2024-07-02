"use server";

import { EnumSignupResult, signupFormSchema } from "@/schemas/formSchema";
import { db } from "@/server/db";
import { accounts, users, verificationTokens } from "@/server/db/schema";
import { EMAIL_VERIFICATION_TOKEN_EXPIRY_WINDOW } from "@/utils/constants/token";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const signup = createSafeActionClient()
  .schema(signupFormSchema)
  .action(async ({ parsedInput: form }) => {
    try {
      const { name, email } = form;

      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser) {
        return {
          type: existingUser.emailVerified
            ? EnumSignupResult.ExistsAndVerified
            : EnumSignupResult.ExistsNotVerified,
        };
      }

      const { newUserId, token } = await db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({
            name,
            email,
          })
          .returning({ newUserId: users.id });

        const { newUserId } = z
          .object({
            newUserId: z.string().min(1),
          })
          .parse(newUser);

        await tx.insert(accounts).values({
          provider: "email",
          providerAccountId: email,
          type: "email",
          userId: newUserId,
        });

        const [verificationToken] = await tx
          .insert(verificationTokens)
          .values({
            identifier: newUserId,
            token: randomUUID(),
            expires: new Date(
              Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRY_WINDOW
            ),
          })
          .returning({ token: verificationTokens.token });

        const { token } = z
          .object({
            token: z.string().min(1),
          })
          .parse(verificationToken);

        return { newUserId, token };
      });

      return { type: EnumSignupResult.EmailSent };
    } catch {
      return { type: EnumSignupResult.Error };
    }
  });
