import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type GetUserInformationFromDbProps = {
  userId: string;
};

export async function getUserInformationFromDb({
  userId,
}: GetUserInformationFromDbProps) {
  const result = await db
    .select({
      name: users.name,
      email: users.email,
      role: users.role,
      image: users.image,
    })
    .from(users)
    .where(and(eq(users.id, userId)));

  return result[0];
}
