import type { CollectionConfig } from "payload"

export const Downloads: CollectionConfig = {
  slug: "downloads",
  admin: { useAsTitle: "name" },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Katalog", value: "katalog" },
        { label: "Certifikát", value: "certifikat" },
        { label: "Technická dokumentace", value: "technicka-dokumentace" },
        { label: "Formuláře", value: "formulare" },
      ],
    },
    {
      name: "manufacturer",
      type: "select",
      required: true,
      options: [
        { label: "SAMSON", value: "SAMSON" },
        { label: "SCHROEDAHL", value: "SCHROEDAHL" },
        { label: "CIRCOR", value: "CIRCOR" },
        { label: "ELCO", value: "ELCO" },
        { label: "Dlouhy Technology", value: "DT" },
      ],
    },
    { name: "file", type: "upload", relationTo: "media", required: true },
    {
      name: "language",
      type: "select",
      defaultValue: "cs",
      options: [
        { label: "Čeština", value: "cs" },
        { label: "English", value: "en" },
        { label: "Deutsch", value: "de" },
        { label: "Slovenčina", value: "sk" },
      ],
    },
    { name: "isPublic", type: "checkbox", defaultValue: true },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
}
