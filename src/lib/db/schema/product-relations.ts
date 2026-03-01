import { relations } from "drizzle-orm"
import { pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core"
import { products } from "./products"

export const productRelations = pgTable(
  "product_relations",
  {
    productId: uuid("product_id")
      .references(() => products.id)
      .notNull(),
    relatedProductId: uuid("related_product_id")
      .references(() => products.id)
      .notNull(),
    relationType: varchar("relation_type", { length: 30 }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.productId, t.relatedProductId] })]
)

export const productRelationsRelations = relations(
  productRelations,
  ({ one }) => ({
    product: one(products, {
      fields: [productRelations.productId],
      references: [products.id],
      relationName: "productFrom",
    }),
    relatedProduct: one(products, {
      fields: [productRelations.relatedProductId],
      references: [products.id],
      relationName: "productTo",
    }),
  })
)
