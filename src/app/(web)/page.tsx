import { Hero, PartnerBar } from "@/components/shared/hero"
import { CategoryCards } from "@/components/shared/category-cards"
import { WhyDT } from "@/components/shared/why-dt"
import { CTABlock } from "@/components/shared/cta-block"
import { ReferenceCard } from "@/components/shared/reference-card"
import { ArticleCard } from "@/components/shared/article-card"
import { AnimateSection } from "@/components/shared/animate-section"
import { db } from "@/lib/db"
import { references, articles } from "@/lib/db/schema"
import { desc, isNull } from "drizzle-orm"

export const revalidate = 86400

async function getLatestReferences() {
  try {
    return await db
      .select({
        customer: references.customer,
        industry: references.industry,
        excerpt: references.excerpt,
        year: references.year,
        slug: references.slug,
      })
      .from(references)
      .where(isNull(references.deletedAt))
      .orderBy(desc(references.year), desc(references.createdAt))
      .limit(3)
  } catch {
    return []
  }
}

async function getLatestArticles() {
  try {
    return await db
      .select({
        title: articles.title,
        perex: articles.perex,
        category: articles.category,
        date: articles.date,
        slug: articles.slug,
      })
      .from(articles)
      .where(isNull(articles.deletedAt))
      .orderBy(desc(articles.date))
      .limit(3)
  } catch {
    return []
  }
}

export default async function HomePage() {
  const [latestReferences, latestArticles] = await Promise.all([
    getLatestReferences(),
    getLatestArticles(),
  ])

  return (
    <>
      <Hero />
      <PartnerBar />
      <AnimateSection>
        <CategoryCards />
      </AnimateSection>
      <AnimateSection>
        <WhyDT />
      </AnimateSection>
      <AnimateSection>
        <CTABlock />
      </AnimateSection>

      {/* References */}
      {latestReferences.length > 0 && (
        <AnimateSection>
          <section className="py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
                Naše reference
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestReferences.map((ref) => (
                  <ReferenceCard key={ref.slug} {...ref} />
                ))}
              </div>
            </div>
          </section>
        </AnimateSection>
      )}

      {/* News */}
      {latestArticles.length > 0 && (
        <AnimateSection>
          <section className="bg-neutral-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
                Novinky
              </h2>
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latestArticles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    title={article.title}
                    perex={article.perex}
                    category={article.category}
                    date={article.date.toISOString()}
                    slug={article.slug}
                  />
                ))}
              </div>
            </div>
          </section>
        </AnimateSection>
      )}
    </>
  )
}
