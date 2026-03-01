import type { CollectionConfig } from "payload"

export const References: CollectionConfig = {
  slug: "references",
  admin: { useAsTitle: "customer" },
  fields: [
    { name: "customer", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    {
      name: "industry",
      type: "select",
      required: true,
      options: [
        { label: "Teplárenství", value: "teplarenstvi" },
        { label: "Energetika", value: "energetika" },
        { label: "Chemie", value: "chemie" },
        { label: "Průmysl", value: "prumysl" },
        { label: "Ostatní", value: "ostatni" },
      ],
    },
    { name: "excerpt", type: "textarea", required: true, maxLength: 500 },
    { name: "content", type: "richText" },
    { name: "year", type: "number", required: true },
    { name: "image", type: "upload", relationTo: "media" },
  ],
}
