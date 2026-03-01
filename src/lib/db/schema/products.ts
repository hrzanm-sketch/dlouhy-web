import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { categories } from "./categories"
import { productParameters } from "./product-parameters"
import { productDocuments } from "./product-documents"
import { productRelations as productRelationsTable } from "./product-relations"

export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  categoryId: uuid("category_id")
    .references(() => categories.id)
    .notNull(),
  slug: varchar("slug", { length: 300 }).unique().notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  typeCode: varchar("type_code", { length: 100 }),
  manufacturer: varchar("manufacturer", { length: 50 }).notNull(),
  shortDescription: varchar("short_description", { length: 300 }),
  longDescription: text("long_description"),
  mainImage: varchar("main_image", { length: 500 }),
  galleryImages: jsonb("gallery_images").$type<string[]>(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 300 }),
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

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  parameters: many(productParameters),
  documents: many(productDocuments),
  relationsFrom: many(productRelationsTable, { relationName: "productFrom" }),
  relationsTo: many(productRelationsTable, { relationName: "productTo" }),
}))
