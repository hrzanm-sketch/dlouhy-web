import { relations, sql } from "drizzle-orm"
import {
  boolean,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { portalUsers } from "./portal-users"

export const portalNotifications = pgTable("portal_notifications", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => portalUsers.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  body: text("body"),
  linkUrl: varchar("link_url", { length: 500 }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const portalNotificationsRelations = relations(
  portalNotifications,
  ({ one }) => ({
    user: one(portalUsers, {
      fields: [portalNotifications.userId],
      references: [portalUsers.id],
    }),
  }),
)
