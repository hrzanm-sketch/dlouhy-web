import { Suspense } from "react"
import { ReferenceCard } from "@/components/shared/reference-card"
import { Pagination } from "@/components/ui/pagination"
import { INDUSTRY_LABELS } from "@/lib/constants"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Reference | Dlouhy Technology",
  description:
    "Reference a realizace Dlouhy Technology — regulacni ventily SAMSON, horaky ELCO, servisni zakázky v teplarenstvi, energetice a chemii.",
}

const MOCK_REFERENCES = [
  { id: "1", slug: "teplarna-brno", customer: "Teplárny Brno a.s.", industry: "teplarenstvi", excerpt: "Dodávka a montáž 12 regulačních ventilů SAMSON série 3241 pro modernizaci předávacích stanic.", year: 2024 },
  { id: "2", slug: "cez-elektrarna-tusimice", customer: "ČEZ a.s. — Elektrárna Tušimice", industry: "energetika", excerpt: "Kompletní výměna recirkulačních ventilů SCHROEDAHL na bloků 22 a 23.", year: 2024 },
  { id: "3", slug: "unipetrol-litvinov", customer: "ORLEN Unipetrol RPA s.r.o.", industry: "chemie", excerpt: "Servis a revize 45 regulačních armatur v provozu ethylénové jednotky.", year: 2023 },
  { id: "4", slug: "skoda-auto-mlada-boleslav", customer: "ŠKODA AUTO a.s.", industry: "prumysl", excerpt: "Instalace hořáků ELCO pro novou lakovací linku — 8 jednotek s řízením emisí.", year: 2023 },
  { id: "5", slug: "veolia-olomouc", customer: "Veolia Energie ČR a.s.", industry: "teplarenstvi", excerpt: "Dodávka ventilů SAMSON typ 3321 pro regulaci páry v teplárně Olomouc.", year: 2022 },
]

const LIMIT = 12

export default async function ReferencePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const industry = typeof params.industry === "string" ? params.industry : undefined
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10))

  const filtered = industry
    ? MOCK_REFERENCES.filter((r) => r.industry === industry)
    : MOCK_REFERENCES

  const total = filtered.length
  const totalPages = Math.ceil(total / LIMIT)
  const references = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavni stranka</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Reference</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Reference</h1>

      {/* Industry filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/reference"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !industry ? "bg-dt-blue text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          )}
        >
          Vše
        </Link>
        {(Object.entries(INDUSTRY_LABELS) as [string, string][]).map(([key, label]) => (
          <Link
            key={key}
            href={`/reference?industry=${key}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              industry === key ? "bg-dt-blue text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {references.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {references.map((ref) => (
            <ReferenceCard
              key={ref.id}
              customer={ref.customer}
              industry={ref.industry}
              excerpt={ref.excerpt}
              year={ref.year}
              slug={ref.slug}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-neutral-500">
          Žádné reference pro vybraný filtr.
        </p>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Suspense>
            <Pagination currentPage={page} totalPages={totalPages} />
          </Suspense>
        </div>
      )}
    </div>
  )
}
