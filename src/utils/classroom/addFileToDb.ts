import { db } from "@/server/db";
import { files } from "@/server/db/schema";

type AddFileToDbProps = {
  fileId: string;
  userId: string;
  name: string;
};

export async function addFileToDb({ fileId, userId, name }: AddFileToDbProps) {
  return db.insert(files).values({
    id: fileId,
    name,
    ownerId: userId,
  });
}
