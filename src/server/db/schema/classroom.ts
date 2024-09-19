import { randomUUID } from "crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";

export const classrooms = sqliteTable("classroom", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  name: text("name", { length: 255 }).notNull(),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const classroomParticpants = sqliteTable(
  "classroomParticipant",
  {
    classroomId: text("classroomId")
      .notNull()
      .references(() => classrooms.id, { onDelete: "cascade" }),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role", {
      enum: [
        EnumClassroomRole.Admin,
        EnumClassroomRole.Teacher,
        EnumClassroomRole.Student,
        EnumClassroomRole.TeachingAssistant,
      ],
    }).notNull(),
    status: text("status", {
      enum: [
        EnumClassroomParticpantStatus.Accepted,
        EnumClassroomParticpantStatus.Invited,
        EnumClassroomParticpantStatus.Pending,
      ],
    }).notNull(),
  },
  (table) => ({
    unq: unique().on(table.classroomId, table.userId),
  })
);
