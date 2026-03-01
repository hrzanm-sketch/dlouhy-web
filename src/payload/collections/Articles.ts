import type { CollectionConfig } from "payload"

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: { useAsTitle: "title" },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "perex", type: "textarea", required: true, maxLength: 500 },
    { name: "content", type: "richText" },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Novinka", value: "novinka" },
        { label: "Technika", value: "technika" },
        { label: "Produkt", value: "produkt" },
        { label: "Akce", value: "akce" },
      ],
    },
    { name: "date", type: "date", required: true },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "author", type: "text" },
  ],
}
