import type { GlobalConfig } from "payload"

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  fields: [
    { name: "siteName", type: "text", required: true, defaultValue: "Dlouhy Technology s.r.o." },
    { name: "contactEmail", type: "email" },
    { name: "phone", type: "text" },
    { name: "address", type: "textarea" },
    { name: "ico", type: "text", label: "IČO" },
    { name: "dic", type: "text", label: "DIČ" },
    { name: "gtmId", type: "text", label: "GTM ID" },
    { name: "footerText", type: "textarea" },
  ],
}
