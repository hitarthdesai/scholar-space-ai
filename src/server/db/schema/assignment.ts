import { randomUUID } from "crypto";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { classrooms } from "./classroom";
import { users } from "./auth";
import { conversations } from "./chat";
import { EnumQuestionType } from "@/schemas/questionSchema";

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
  id: text("id").primaryKey().notNull(),
  assignmentId: text("assignmentId")
    .notNull()
    .references(() => assignments.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type", {
    enum: [
      EnumQuestionType.Code,
      EnumQuestionType.SingleCorrectMcq,
      EnumQuestionType.MultiCorrectMcq,
    ],
  })
    .notNull()
    .default(EnumQuestionType.Code),
});

export const questionOptions = sqliteTable("questionOption", {
  optionId: text("optionId").primaryKey().notNull(),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  isCorrect: integer("isCorrect", { mode: "boolean" }).notNull(),
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

export const questionAttempts = sqliteTable("questionAttempt", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  questionId: text("questionId")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  conversationId: text("conversationId").references(() => conversations.id, {
    onDelete: "set null",
  }),
  submitted: integer("submitted", { mode: "timestamp_ms" }),
  // TODO: Remove this column. We store code in AWS S3 now.
  answer: text("answer", { length: 255 }).notNull(),
});

export const questionAttemptsRelations = relations(
  questionAttempts,
  ({ one }) => ({
    user: one(users, {
      fields: [questionAttempts.userId],
      references: [users.id],
    }),
    question: one(questions, {
      fields: [questionAttempts.questionId],
      references: [questions.id],
    }),
    conversation: one(conversations, {
      fields: [questionAttempts.conversationId],
      references: [conversations.id],
    }),
  })
);
