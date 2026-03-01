import type { Metadata } from "next"
import { db } from "@/lib/db"
import { downloads } from "@/lib/db/schema"
import { and, eq, isNull, asc } from "drizzle-orm"
import { DownloadCard } from "@/components/shared/download-card"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Dokumenty ke stažení",
  description:
    "Katalogy, certifikáty, technická dokumentace a formuláře ke stažení. SAMSON, SCHROEDAHL, CIRCOR, ELCO.",
}

const CATEGORIES = [
  { value: "", label: "Vše" },
  { value: "katalog", label: "Katalogy" },
  { value: "certifikat", label: "Certifikáty" },
  { value: "technicka-dokumentace", label: "Technická dokumentace" },
  { value: "formulare", label: "Formuláře" },
] as const

const MANUFACTURERS = [
  { value: "", label: "Všichni výrobci" },
  { value: "SAMSON", label: "SAMSON" },
  { value: "SCHROEDAHL", label: "SCHROEDAHL" },
  { value: "CIRCOR", label: "CIRCOR" },
  { value: "ELCO", label: "ELCO" },
  { value: "DT", label: "Dlouhý Technology" },
] as const

async function getDownloads(category?: string, manufacturer?: string) {
  const conditions = [
    eq(downloads.isPublic, true),
    isNull(downloads.deletedAt),
  ]

  if (category) {
    conditions.push(eq(downloads.category, category))
  }
  if (manufacturer) {
    conditions.push(eq(downloads.manufacturer, manufacturer))
  }

  return db
    .select()
    .from(downloads)
    .where(and(...conditions))
    .orderBy(asc(downloads.sortOrder), asc(downloads.name))
}

export default async function KeStazeniPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; manufacturer?: string }>
}) {
  const params = await searchParams
  const category = params.category || ""
  const manufacturer = params.manufacturer || ""
  const allDownloads = await getDownloads(
    category || undefined,
    manufacturer || undefined
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold text-neutral-900">
        Dokumenty ke stažení
      </h1>
      <p className="mb-8 text-lg text-neutral-500">
        Katalogy, certifikáty, technická dokumentace a formuláře
      </p>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={
                cat.value
                  ? `/ke-stazeni?category=${cat.value}${manufacturer ? `&manufacturer=${manufacturer}` : ""}`
                  : `/ke-stazeni${manufacturer ? `?manufacturer=${manufacturer}` : ""}`
              }
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-dt-blue text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Manufacturer filter */}
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {MANUFACTURERS.map((m) => {
            const params = new URLSearchParams()
            if (category) params.set("category", category)
            if (m.value) params.set("manufacturer", m.value)
            const qs = params.toString()
            return (
              <a
                key={m.value}
                href={`/ke-stazeni${qs ? `?${qs}` : ""}`}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  manufacturer === m.value
                    ? "bg-neutral-800 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {m.label}
              </a>
            )
          })}
        </div>
      </div>

      {/* Download grid */}
      {allDownloads.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allDownloads.map((dl) => (
            <DownloadCard key={dl.id} download={dl} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white px-6 py-12 text-center">
          <p className="text-neutral-500">
            Žádné dokumenty nebyly nalezeny pro zvolené filtry.
          </p>
        </div>
      )}
    </section>
  )
}
