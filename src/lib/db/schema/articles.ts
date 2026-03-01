import { sql } from "drizzle-orm"
import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const articles = pgTable("articles", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  perex: varchar("perex", { length: 500 }).notNull(),
  content: text("content"),
  category: varchar("category", { length: 50 }).notNull(),
  date: timestamp("date", { withTimezone: true }).defaultNow().notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
  author: varchar("author", { length: 200 }),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})
