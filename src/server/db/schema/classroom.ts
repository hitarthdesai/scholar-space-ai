import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const classrooms = sqliteTable("classroom", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  name: text("name", { length: 255 }).notNull(),
  teacherId: text("teacherId").notNull(),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const classroomStudents = sqliteTable("classroomStudent", {
  classroomId: text("classroomId")
    .notNull()
    .references(() => classrooms.id, { onDelete: "cascade" }),
  studentId: text("studentId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const classroomRelations = relations(classrooms, ({ one }) => ({
  teacher: one(users, {
    fields: [classrooms.teacherId],
    references: [users.id],
  }),
}));

export const classroomStudentsRelations = relations(
  classroomStudents,
  ({ one }) => ({
    classroom: one(classrooms, {
      fields: [classroomStudents.classroomId],
      references: [classrooms.id],
    }),
    student: one(users, {
      fields: [classroomStudents.studentId],
      references: [users.id],
    }),
  })
);
