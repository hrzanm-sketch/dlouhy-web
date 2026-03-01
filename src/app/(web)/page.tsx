import { Hero, PartnerBar } from "@/components/shared/hero"
import { CategoryCards } from "@/components/shared/category-cards"
import { WhyDT } from "@/components/shared/why-dt"
import { CTABlock } from "@/components/shared/cta-block"
import { ReferenceCard } from "@/components/shared/reference-card"
import { ArticleCard } from "@/components/shared/article-card"

export const revalidate = 86400

const PLACEHOLDER_REFERENCES = [
  {
    customer: "ČEZ Teplárna Trmice",
    industry: "teplarenstvi",
    excerpt:
      "Dodávka a montáž regulačních ventilů SAMSON pro parní rozvody v teplárně o výkonu 200 MW.",
    year: 2024,
    slug: "cez-teplarna-trmice",
  },
  {
    customer: "Veolia Energie Praha",
    industry: "energetika",
    excerpt:
      "Kompletní servis a výměna regulačních armatur na horkovodním napáječi.",
    year: 2023,
    slug: "veolia-energie-praha",
  },
  {
    customer: "Dalkia Ostrava",
    industry: "teplarenstvi",
    excerpt:
      "Instalace recirkulačních ventilů SCHROEDAHL pro ochranu napájecích čerpadel.",
    year: 2023,
    slug: "dalkia-ostrava",
  },
]

const PLACEHOLDER_ARTICLES = [
  {
    title: "Nová řada regulačních ventilů SAMSON Type 3241",
    perex:
      "SAMSON rozšiřuje portfolio o novou řadu kompaktních regulačních ventilů pro průmyslové aplikace.",
    category: "produkt",
    date: "2024-11-15",
    slug: "nova-rada-samson-3241",
  },
  {
    title: "Servisní workshop pro zákazníky 2024",
    perex:
      "Zveme vás na tradiční workshop zaměřený na údržbu a diagnostiku regulačních ventilů.",
    category: "akce",
    date: "2024-10-02",
    slug: "servisni-workshop-2024",
  },
  {
    title: "Jak správně dimenzovat regulační ventil",
    perex:
      "Praktický průvodce výběrem správné velikosti regulačního ventilu pro vaši aplikaci.",
    category: "technika",
    date: "2024-09-18",
    slug: "dimenzovani-regulacniho-ventilu",
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <PartnerBar />
      <CategoryCards />
      <WhyDT />
      <CTABlock />

      {/* References */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Naše reference
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_REFERENCES.map((ref) => (
              <ReferenceCard key={ref.slug} {...ref} />
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900 sm:text-4xl">
            Novinky
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLACEHOLDER_ARTICLES.map((article) => (
              <ArticleCard key={article.slug} {...article} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
