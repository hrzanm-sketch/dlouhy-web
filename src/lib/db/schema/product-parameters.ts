import { relations, sql } from "drizzle-orm"
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { products } from "./products"

export const productParameters = pgTable("product_parameters", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  value: varchar("value", { length: 500 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
})

export const productParametersRelations = relations(
  productParameters,
  ({ one }) => ({
    product: one(products, {
      fields: [productParameters.productId],
      references: [products.id],
    }),
  })
)
