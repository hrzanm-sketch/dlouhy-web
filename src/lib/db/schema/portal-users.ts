import { relations, sql } from "drizzle-orm"
import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const portalUsers = pgTable("portal_users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }),
  firstName: varchar("first_name", { length: 200 }).notNull(),
  lastName: varchar("last_name", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  jobTitle: varchar("job_title", { length: 200 }),
  companyId: uuid("company_id").notNull(),
  role: varchar("role", { length: 30 }).default("portal_user"),
  isActive: boolean("is_active").default(false),
  emailNotifications: jsonb("email_notifications").default({}),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  invitedBy: uuid("invited_by"),
  inviteToken: varchar("invite_token", { length: 255 }),
  inviteExpiresAt: timestamp("invite_expires_at", { withTimezone: true }),
  resetToken: text("reset_token"),
  resetExpiresAt: timestamp("reset_expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})

export const portalUsersRelations = relations(portalUsers, ({ one }) => ({
  inviter: one(portalUsers, {
    fields: [portalUsers.invitedBy],
    references: [portalUsers.id],
    relationName: "inviter",
  }),
}))
