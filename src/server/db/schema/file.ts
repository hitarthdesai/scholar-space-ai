import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { classrooms } from "./classroom";

export const files = sqliteTable("file", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }).notNull(),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  added: integer("expires", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.ownerId],
    references: [users.id],
  }),
}));

export const classroomFiles = sqliteTable("classroomFile", {
  fileId: text("fileId").references(() => files.id, { onDelete: "cascade" }),
  classroomId: text("classroomId").references(() => classrooms.id, {
    onDelete: "cascade",
  }),
});

export const classroomFilesRelations = relations(classroomFiles, ({ one }) => ({
  file: one(files, {
    fields: [classroomFiles.fileId],
    references: [files.id],
  }),
  classroom: one(classrooms, {
    fields: [classroomFiles.classroomId],
    references: [classrooms.id],
  }),
}));
