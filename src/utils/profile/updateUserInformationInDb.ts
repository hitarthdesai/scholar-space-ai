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
}: updateUserInformationProps) {
  return db.update(users).set({ name: newName }).where(eq(users.id, userId));
}
