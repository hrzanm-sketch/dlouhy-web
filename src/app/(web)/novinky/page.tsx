import { Suspense } from "react"
import { ArticleCard } from "@/components/shared/article-card"
import { Pagination } from "@/components/ui/pagination"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { desc, eq, isNull, and, count } from "drizzle-orm"

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

const LIMIT = 12

export default async function NovinkyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : undefined
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10))

  const whereConditions = category
    ? and(isNull(articles.deletedAt), eq(articles.category, category))
    : isNull(articles.deletedAt)

  let rows: { id: string; slug: string; title: string; perex: string; category: string; date: Date }[] = []
  let total = 0

  try {
    const [queryRows, totalResult] = await Promise.all([
      db
        .select({
          id: articles.id,
          slug: articles.slug,
          title: articles.title,
          perex: articles.perex,
          category: articles.category,
          date: articles.date,
        })
        .from(articles)
        .where(whereConditions)
        .orderBy(desc(articles.date))
        .limit(LIMIT)
        .offset((page - 1) * LIMIT),
      db
        .select({ count: count() })
        .from(articles)
        .where(whereConditions),
    ])
    rows = queryRows
    total = totalResult[0]?.count ?? 0
  } catch {
    // Table may not exist yet
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavní stránka</Link>
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
          Vše
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
      {rows.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              perex={article.perex}
              category={article.category}
              date={article.date.toISOString()}
              slug={article.slug}
            />
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-neutral-500">
          Žádné články pro vybranou kategorii.
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
