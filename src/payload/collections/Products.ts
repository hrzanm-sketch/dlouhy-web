import type { CollectionConfig } from "payload"

export const Products: CollectionConfig = {
  slug: "products",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "typeCode", type: "text", label: "Type Code" },
    {
      name: "manufacturer",
      type: "select",
      required: true,
      options: ["SAMSON", "SCHROEDAHL", "CIRCOR", "ELCO"],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    { name: "shortDescription", type: "textarea", maxLength: 300 },
    { name: "longDescription", type: "richText" },
    { name: "mainImage", type: "upload", relationTo: "media" },
    {
      name: "galleryImages",
      type: "array",
      fields: [{ name: "image", type: "upload", relationTo: "media" }],
    },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "isFeatured", type: "checkbox", defaultValue: false },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "seoTitle", type: "text" },
    { name: "seoDescription", type: "textarea", maxLength: 300 },
  ],
}
