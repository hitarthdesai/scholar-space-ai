import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type DeleteFileFromDbProps = {
  fileId: string;
};

export async function deleteFileFromDb({ fileId }: DeleteFileFromDbProps) {
  return db.delete(files).where(eq(files.id, fileId));
}
