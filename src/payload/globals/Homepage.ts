import type { GlobalConfig } from "payload"

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  fields: [
    { name: "heroTitle", type: "text", required: true },
    { name: "heroSubtitle", type: "textarea", maxLength: 300 },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "sections",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "content", type: "richText" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "link", type: "text" },
        { name: "sortOrder", type: "number", defaultValue: 0 },
      ],
    },
  ],
}
