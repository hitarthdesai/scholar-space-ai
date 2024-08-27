import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { classrooms } from "./classroom";
import { users } from "./auth";
import { conversations } from "./chat";

export const assignments = sqliteTable("assignment", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  name: text("name", { length: 255 }).notNull(),
  created_at: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const questions = sqliteTable("question", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => randomUUID()),
  assignmentId: text("assignmentId")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  question: text("question", { length: 255 }).notNull(),
});

export const classroomAssignments = sqliteTable("classroomAssignment", {
  classroomId: text("classroomId")
    .notNull()
    .references(() => classrooms.id, { onDelete: "cascade" }),
  assignmentId: text("assignmentId")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
});

export const classroomAssignmentsRelations = relations(
  classroomAssignments,
  ({ one }) => ({
    classroom: one(classrooms, {
      fields: [classroomAssignments.classroomId],
      references: [classrooms.id],
    }),
    assignment: one(assignments, {
      fields: [classroomAssignments.assignmentId],
      references: [assignments.id],
    }),
  })
);

export const userQuestions = sqliteTable("userQuestion", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  conversationId: text("conversationId").references(() => conversations.id, {
    onDelete: "set null",
  }),
  answer: text("answer", { length: 255 }).notNull(),
});

export const userQuestionsRelations = relations(userQuestions, ({ one }) => ({
  user: one(users, {
    fields: [userQuestions.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [userQuestions.questionId],
    references: [questions.id],
  }),
  conversation: one(conversations, {
    fields: [userQuestions.conversationId],
    references: [conversations.id],
  }),
}));
