export const MANUFACTURERS = ["SAMSON", "SCHROEDAHL", "CIRCOR", "ELCO"] as const
export type Manufacturer = (typeof MANUFACTURERS)[number]

export const INDUSTRIES = [
  "teplarenstvi",
  "energetika",
  "chemie",
  "prumysl",
  "ostatni",
] as const
export type Industry = (typeof INDUSTRIES)[number]

export const INDUSTRY_LABELS: Record<Industry, string> = {
  teplarenstvi: "Teplárenství",
  energetika: "Energetika",
  chemie: "Chemie",
  prumysl: "Průmysl",
  ostatni: "Ostatní",
}

export const PRODUCT_DOCUMENT_TYPES = [
  "datasheet",
  "manual",
  "certificate",
  "drawing",
  "brochure",
] as const

export const LEAD_TYPES = ["inquiry", "service", "claim", "contact"] as const

export const LEAD_STATUSES = [
  "new",
  "sent_to_intranet",
  "failed",
  "processed",
] as const

export const URGENCY_LEVELS = ["normal", "urgent", "critical"] as const

export const ARTICLE_CATEGORIES = [
  "novinka",
  "technika",
  "produkt",
  "akce",
] as const

export const NAV_ITEMS = [
  { label: "Produkty", href: "/produkty" },
  { label: "Servis", href: "/servis" },
  { label: "Reference", href: "/reference" },
  { label: "Novinky", href: "/novinky" },
  { label: "Ke stažení", href: "/ke-stazeni" },
  { label: "Kontakt", href: "/kontakt" },
] as const
