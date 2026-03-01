import type { CollectionConfig } from "payload"

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "richText" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "parent", type: "relationship", relationTo: "categories" },
    {
      name: "manufacturer",
      type: "select",
      options: ["SAMSON", "SCHROEDAHL", "CIRCOR", "ELCO"],
    },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "isActive", type: "checkbox", defaultValue: true },
  ],
}
