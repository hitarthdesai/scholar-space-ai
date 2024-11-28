import { relations } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";

export const files = sqliteTable("file", {
  id: text("id").primaryKey().notNull(),
  name: text("name", { length: 255 }),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id),
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(users, {
    fields: [files.ownerId],
    references: [users.id],
  }),
}));
