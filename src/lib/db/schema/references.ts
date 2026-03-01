import { sql } from "drizzle-orm"
import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const references = pgTable("references", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  customer: varchar("customer", { length: 300 }).notNull(),
  industry: varchar("industry", { length: 50 }).notNull(),
  excerpt: varchar("excerpt", { length: 500 }).notNull(),
  content: text("content"),
  year: integer("year").notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
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
