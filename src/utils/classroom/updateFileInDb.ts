import { db } from "@/server/db";
import { files } from "@/server/db/schema";
import { eq } from "drizzle-orm";

type UpdateFileInDbProps = {
  fileId: string;
  name: string;
};

export async function updateFileInDb({ name, fileId }: UpdateFileInDbProps) {
  return db
    .update(files)
    .set({
      name,
    })
    .where(eq(files.id, fileId));
}
