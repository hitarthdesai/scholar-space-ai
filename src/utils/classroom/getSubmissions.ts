import { db } from "@/server/db";
import { questions } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export function getSubmissions({
  classroomId,
  assignmentId,
}: {
  classroomId: string;
  assignmentId: string;
}) {}
