import { relations, sql } from "drizzle-orm"
import {
  boolean,
  date,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { products } from "./products"

export const webLeads = pgTable("web_leads", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  type: varchar("type", { length: 30 }).notNull(),
  status: varchar("status", { length: 30 }).default("new"),
  intranetCaseId: uuid("intranet_case_id"),
  companyName: varchar("company_name", { length: 300 }).notNull(),
  contactName: varchar("contact_name", { length: 300 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  ico: varchar("ico", { length: 20 }),
  productId: uuid("product_id").references(() => products.id),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  urgency: varchar("urgency", { length: 30 }),
  preferredDate: date("preferred_date"),
  location: varchar("location", { length: 200 }),
  desiredResolution: varchar("desired_resolution", { length: 50 }),
  metadata: jsonb("metadata").default({}),
  sourceUrl: varchar("source_url", { length: 500 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  gdprConsent: boolean("gdpr_consent").notNull().default(false),
  newsletterConsent: boolean("newsletter_consent").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const webLeadsRelations = relations(webLeads, ({ one }) => ({
  product: one(products, {
    fields: [webLeads.productId],
    references: [products.id],
  }),
}))
