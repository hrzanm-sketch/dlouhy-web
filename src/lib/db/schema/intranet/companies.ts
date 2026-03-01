import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export type CompanyAddress = {
  street: string
  city: string
  zip: string
  country: string
  type: "billing" | "shipping"
}

export type CompanyContact = {
  name: string
  email?: string
  phone?: string
  role?: string
  isPrimary?: boolean
}

export const intranetCompanies = pgTable("companies", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  ico: varchar("ico", { length: 20 }),
  dic: varchar("dic", { length: 20 }),
  addresses: jsonb("addresses").$type<CompanyAddress[]>().default([]),
  contacts: jsonb("contacts").$type<CompanyContact[]>().default([]),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})
