import { relations, sql } from "drizzle-orm"
import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { products } from "./products"

export const productDocuments = pgTable("product_documents", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  name: varchar("name", { length: 300 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  language: varchar("language", { length: 5 }).default("cs"),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  fileSize: integer("file_size"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const productDocumentsRelations = relations(
  productDocuments,
  ({ one }) => ({
    product: one(products, {
      fields: [productDocuments.productId],
      references: [products.id],
    }),
  })
)
