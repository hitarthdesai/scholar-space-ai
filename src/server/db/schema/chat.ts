import { EnumConversationType, EnumMessageRole } from "@/schemas/chatSchema";
import { CHAT_PROMPT_INPUT_MAX_LENGTH } from "@/utils/constants/chat";
import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { users } from "./auth";

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
  type: text("type", {
    enum: [EnumConversationType.Free, EnumConversationType.Question],
  })
    .notNull()
    .default(EnumConversationType.Question),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  name: text("name").notNull().default("Conversation"),
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

export const userConversations = sqliteTable("userConversation", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conversationId: text("conversationId")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
});

export const userConversationsRelations = relations(
  userConversations,
  ({ one }) => ({
    user: one(users, {
      fields: [userConversations.userId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [userConversations.conversationId],
      references: [conversations.id],
    }),
  })
);
