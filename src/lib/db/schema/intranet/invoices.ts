import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const intranetInvoices = pgTable("invoices", {
  id: uuid("id").primaryKey(),
  companyId: uuid("company_id").notNull(),
  orderId: uuid("order_id"),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("invoice"),
  amount: integer("amount").notNull().default(0),
  currency: varchar("currency", { length: 3 }).notNull().default("CZK"),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  issueDate: date("issue_date").notNull(),
  dueDate: date("due_date").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
})
