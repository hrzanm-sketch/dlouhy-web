import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { db } from "@/lib/db"
import { articles } from "@/lib/db/schema"
import { eq, and, isNull } from "drizzle-orm"

export const revalidate = 3600

const CATEGORY_COLORS: Record<string, string> = {
  novinka: "bg-blue-100 text-blue-800",
  technika: "bg-green-100 text-green-800",
  produkt: "bg-purple-100 text-purple-800",
  akce: "bg-orange-100 text-orange-800",
}

const CATEGORY_LABELS: Record<string, string> = {
  novinka: "Novinka",
  technika: "Technika",
  produkt: "Produkt",
  akce: "Akce",
}

async function getArticleBySlug(slug: string) {
  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), isNull(articles.deletedAt)))
      .limit(1)
    return article ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: "Novinky | Dlouhy Technology" }
  return {
    title: `${article.title} | Dlouhy Technology`,
    description: article.perex,
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavní stránka</Link>
        <span className="mx-2">/</span>
        <Link href="/novinky" className="hover:text-dt-blue">Novinky</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{article.title}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img src={article.imageUrl} alt={article.title} className="h-64 w-full object-cover" />
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              CATEGORY_COLORS[article.category] ?? "bg-neutral-100 text-neutral-800"
            )}
          >
            {CATEGORY_LABELS[article.category] ?? article.category}
          </span>
          <span className="text-sm text-neutral-400">{formatDate(article.date.toISOString())}</span>
          {article.author && (
            <>
              <span className="text-sm text-neutral-300">&middot;</span>
              <span className="text-sm text-neutral-500">{article.author}</span>
            </>
          )}
        </div>

        <h1 className="mb-4 text-3xl font-bold text-neutral-900">{article.title}</h1>
        <p className="mb-8 text-lg text-neutral-600">{article.perex}</p>

        {article.content && (
          <div
            className="prose max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <Link
            href="/novinky"
            className="text-sm font-medium text-dt-blue hover:underline"
          >
            &larr; Zpět na novinky
          </Link>
        </div>
      </article>
    </div>
  )
}
