import { Suspense } from "react"
import { ArticleCard } from "@/components/shared/article-card"
import { Pagination } from "@/components/ui/pagination"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Novinky | Dlouhy Technology",
  description:
    "Aktuality, technicke clanky a novinky z oboru regulacnich ventilu, horaku a prumyslove automatizace.",
}

const CATEGORY_LABELS: Record<string, string> = {
  novinka: "Novinka",
  technika: "Technika",
  produkt: "Produkt",
  akce: "Akce",
}

const MOCK_ARTICLES = [
  { id: "1", slug: "samson-serie-3730-novy-pozicioner", title: "SAMSON s\u00e9rie 3730 \u2014 nov\u00fd inteligentn\u00ed pozicion\u00e9r", perex: "P\u0159edstavujeme novou generaci elektropneumatick\u00fdch pozicion\u00e9r\u016f SAMSON \u0159ady 3730 s integrovanou diagnostikou a komunikac\u00ed HART 7.", category: "produkt", date: "2024-11-15T00:00:00Z" },
  { id: "2", slug: "modernizace-teplarny-brno-2024", title: "\u00dasp\u011b\u0161n\u00e1 modernizace p\u0159ed\u00e1vac\u00edch stanic v Brn\u011b", perex: "Dokon\u010dili jsme rozs\u00e1hlou modernizaci 12 p\u0159ed\u00e1vac\u00edch stanic pro Tepl\u00e1rny Brno. Nov\u00e9 regula\u010dn\u00ed ventily SAMSON zaji\u0161\u0165uj\u00ed p\u0159esn\u011bj\u0161\u00ed regulaci a ni\u017e\u0161\u00ed spot\u0159ebu.", category: "novinka", date: "2024-10-22T00:00:00Z" },
  { id: "3", slug: "regulace-pary-vysoke-parametry", title: "Regulace p\u00e1ry p\u0159i vysok\u00fdch parametrech \u2014 technick\u00fd p\u0159ehled", perex: "Technick\u00fd \u010dl\u00e1nek o specifik\u00e1ch regulace p\u00e1ry p\u0159i tlac\u00edch nad 40 bar a teplot\u00e1ch p\u0159esahuj\u00edc\u00edch 400 \u00b0C. V\u00fdb\u011br materi\u00e1l\u016f, typov\u00e9 \u0159ady ventil\u016f.", category: "technika", date: "2024-09-10T00:00:00Z" },
  { id: "4", slug: "elco-nextron-2025", title: "ELCO NEXTRON \u2014 nov\u00e1 \u0159ada kondenza\u010dn\u00edch ho\u0159\u00e1k\u016f", perex: "ELCO uv\u00e1d\u00ed na trh ho\u0159\u00e1ky NEXTRON s \u00fa\u010dinnost\u00ed p\u0159es 98 % a ultra-n\u00edzk\u00fdmi emisemi NOx pod 30 mg/kWh.", category: "produkt", date: "2024-08-05T00:00:00Z" },
  { id: "5", slug: "den-otevrenych-dveri-2024", title: "Den otev\u0159en\u00fdch dve\u0159\u00ed \u2014 15. listopadu 2024", perex: "Zveme V\u00e1s na den otev\u0159en\u00fdch dve\u0159\u00ed v na\u0161\u00ed servisn\u00ed d\u00edln\u011b v Brn\u011b. Uk\u00e1zky oprav ventil\u016f, p\u0159edn\u00e1\u0161ky o diagnostice, ob\u010derstven\u00ed.", category: "akce", date: "2024-07-20T00:00:00Z" },
]

const LIMIT = 12

export default async function NovinkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : undefined
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10))

  const filtered = category
    ? MOCK_ARTICLES.filter((a) => a.category === category)
    : MOCK_ARTICLES

  const total = filtered.length
  const totalPages = Math.ceil(total / LIMIT)
  const articles = filtered.slice((page - 1) * LIMIT, page * LIMIT)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavni stranka</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Novinky</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Novinky</h1>

      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/novinky"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            !category ? "bg-dt-blue text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          )}
        >
          V\u0161e
        </Link>
        {(Object.entries(CATEGORY_LABELS) as [string, string][]).map(([key, label]) => (
          <Link
            key={key}
            href={`/novinky?category=${key}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              category === key ? "bg-dt-blue text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              perex={article.perex}
              category={article.category}
              date={article.date}
              slug={article.slug}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-neutral-500">
          \u017d\u00e1dn\u00e9 \u010dl\u00e1nky pro vybranou kategorii.
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
