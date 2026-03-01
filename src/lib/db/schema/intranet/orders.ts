import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const intranetOrders = pgTable("orders", {
  id: uuid("id").primaryKey(),
  companyId: uuid("company_id").notNull(),
  orderNumber: varchar("order_number", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("customer"),
  amount: integer("amount").notNull().default(0),
  currency: varchar("currency", { length: 3 }).notNull().default("CZK"),
  status: varchar("status", { length: 20 }).notNull().default("ordered"),
  orderedAt: timestamp("ordered_at", { withTimezone: true }).notNull(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
  shippedAt: timestamp("shipped_at", { withTimezone: true }),
  deliveryDate: date("delivery_date"),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})
