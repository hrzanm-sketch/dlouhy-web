import { sql } from "drizzle-orm"
import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const webPageContent = pgTable("web_page_content", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  pageKey: varchar("page_key", { length: 100 }).unique().notNull(),
  title: varchar("title", { length: 500 }),
  content: text("content"),
  metadata: jsonb("metadata").default({}),
  locale: varchar("locale", { length: 5 }).default("cs"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
