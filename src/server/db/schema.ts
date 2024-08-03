import { EnumMessageRole } from "@/schemas/chatSchema";
import { EnumRole } from "@/schemas/userSchema";
import { CHAT_PROMPT_INPUT_MAX_LENGTH } from "@/utils/constants/chat";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { type AdapterAccount } from "next-auth/adapters";
import { randomUUID } from "crypto";

export const users = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }),
  email: text("email", { length: 255 }).notNull().unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image", { length: 255 }).default(""),
  role: text("role", { enum: [EnumRole.Student, EnumRole.Teacher] }).default(
    EnumRole.Student
  ),
});

export const usersRelations = relations(users, ({ one }) => ({
  account: one(accounts, {
    fields: [users.id],
    references: [accounts.userId],
  }),
}));

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id),
    type: text("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: text("provider", { length: 255 }).notNull(),
    providerAccountId: text("providerAccountId", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type", { length: 255 }),
    scope: text("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: text("session_state", { length: 255 }),
  },
  (account) => ({
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessions = sqliteTable(
  "session",
  {
    sessionToken: text("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", {
      mode: "timestamp",
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier", { length: 255 }).notNull(),
    token: text("token", { length: 255 }).notNull(),
    expires: integer("expires", {
      mode: "timestamp",
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const messages = sqliteTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  message: text("message", {
    length: CHAT_PROMPT_INPUT_MAX_LENGTH,
  }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  by: text("by", {
    enum: [EnumMessageRole.User, EnumMessageRole.Assistant],
  }).notNull(),
});

export const conversations = sqliteTable("conversation", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const conversationMessages = sqliteTable("conversationMessage", {
  conversationId: text("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  messageId: text("messageId")
    .notNull()
    .references(() => messages.id, { onDelete: "cascade" }),
});

export const conversationMessagesRelations = relations(
  conversationMessages,
  ({ one }) => ({
    conversation: one(conversations, {
      fields: [conversationMessages.conversationId],
      references: [conversations.id],
    }),
    message: one(messages, {
      fields: [conversationMessages.messageId],
      references: [messages.id],
    }),
  })
);
