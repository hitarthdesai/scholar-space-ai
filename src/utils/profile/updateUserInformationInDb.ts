import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type updateUserInformationProps = {
  userId: string;
  newName: string;
};

export async function updateUserInformationInDb({
  userId,
  newName,
}: updateUserInformationProps): Promise<boolean> {
  const result = await db
    .update(users)
    .set({ name: newName })
    .where(eq(users.id, userId));

  return result.rows.length > 0;
}
