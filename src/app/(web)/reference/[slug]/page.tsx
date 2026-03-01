import { notFound } from "next/navigation"
import { INDUSTRY_LABELS } from "@/lib/constants"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

export const revalidate = 86400

const MOCK_REFERENCES = [
  { slug: "teplarna-brno", customer: "Teplárny Brno a.s.", industry: "teplarenstvi", excerpt: "Dodávka a montáž 12 regulačních ventilů SAMSON série 3241 pro modernizaci předávacích stanic.", content: "<p>Teplárny Brno provozují rozsáhlou síť centrálního zásobování teplem. V rámci modernizace předávacích stanic jsme dodali a namontovali 12 kusů regulačních ventilů SAMSON série 3241 s elektrickými pohony. Ventily zajišťují přesnou regulaci teploty a průtoku v sekundárním okruhu.</p><p>Součástí dodávky byla kompletní projektová dokumentace, montáž, zprovoznění a zaškolení obsluhy. Realizace proběhla v letní odstávce 2024 bez dopadu na zásobování teplem.</p>", year: 2024, imageUrl: null },
  { slug: "cez-elektrarna-tusimice", customer: "ČEZ a.s. — Elektrárna Tušimice", industry: "energetika", excerpt: "Kompletní výměna recirkulačních ventilů SCHROEDAHL na bloků 22 a 23.", content: "<p>V rámci plánované odstávky bloků 22 a 23 Elektrárny Tušimice II jsme provedli kompletní výměnu recirkulačních ventilů SCHROEDAHL typu RV. Nové ventily splňují zpřísněné emisní normy a zvyšují účinnost recirkulace spalin.</p>", year: 2024, imageUrl: null },
  { slug: "unipetrol-litvinov", customer: "ORLEN Unipetrol RPA s.r.o.", industry: "chemie", excerpt: "Servis a revize 45 regulačních armatur v provozu ethylénové jednotky.", content: "<p>Pro ORLEN Unipetrol jsme zajistili pravidelný servis a revizi 45 regulačních armatur různých typů v provozu ethylénové jednotky v Litvínově. Práce zahrnovaly demontáž, repasi, kalibraci a zpětnou montáž s kompletní dokumentací dle požadavků ATEX.</p>", year: 2023, imageUrl: null },
  { slug: "skoda-auto-mlada-boleslav", customer: "ŠKODA AUTO a.s.", industry: "prumysl", excerpt: "Instalace hořáků ELCO pro novou lakovací linku — 8 jednotek s řízením emisí.", content: "<p>Pro novou lakovací linku v závodě Mladá Boleslav jsme dodali a zprovoznili 8 hořáků ELCO s pokročilým řízením emisí. Hořáky splňují nejpřísnější emisní limity a zajišťují rovnoměrný ohřev v sušicích komorách.</p>", year: 2023, imageUrl: null },
  { slug: "veolia-olomouc", customer: "Veolia Energie ČR a.s.", industry: "teplarenstvi", excerpt: "Dodávka ventilů SAMSON typ 3321 pro regulaci páry v teplárně Olomouc.", content: "<p>Pro Veolia Energie jsme dodali sadu regulačních ventilů SAMSON typ 3321 určených pro regulaci páry v teplárně Olomouc. Ventily jsou vybaveny pneumatickými pohony a polohovou zpětnou vazbou pro integraci do řídicího systému.</p>", year: 2022, imageUrl: null },
]

const INDUSTRY_COLORS: Record<string, string> = {
  teplarenstvi: "bg-orange-100 text-orange-800",
  energetika: "bg-blue-100 text-blue-800",
  chemie: "bg-green-100 text-green-800",
  prumysl: "bg-purple-100 text-purple-800",
  ostatni: "bg-neutral-100 text-neutral-800",
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const ref = MOCK_REFERENCES.find((r) => r.slug === slug)
  if (!ref) return { title: "Reference | Dlouhy Technology" }
  return {
    title: `${ref.customer} | Reference | Dlouhy Technology`,
    description: ref.excerpt,
  }
}

export default async function ReferenceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const ref = MOCK_REFERENCES.find((r) => r.slug === slug)
  if (!ref) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavni stranka</Link>
        <span className="mx-2">/</span>
        <Link href="/reference" className="hover:text-dt-blue">Reference</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{ref.customer}</span>
      </nav>

      <article className="mx-auto max-w-3xl">
        {ref.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img src={ref.imageUrl} alt={ref.customer} className="h-64 w-full object-cover" />
          </div>
        )}

        <div className="mb-6 flex items-center gap-3">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              INDUSTRY_COLORS[ref.industry] ?? INDUSTRY_COLORS.ostatni
            )}
          >
            {INDUSTRY_LABELS[ref.industry as keyof typeof INDUSTRY_LABELS] ?? ref.industry}
          </span>
          <span className="text-sm text-neutral-400">{ref.year}</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-neutral-900">{ref.customer}</h1>
        <p className="mb-8 text-lg text-neutral-600">{ref.excerpt}</p>

        {ref.content && (
          <div
            className="prose max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: ref.content }}
          />
        )}

        <div className="mt-12 border-t border-neutral-200 pt-8">
          <Link
            href="/reference"
            className="text-sm font-medium text-dt-blue hover:underline"
          >
            ← Zpět na reference
          </Link>
        </div>
      </article>
    </div>
  )
}
