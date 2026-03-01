import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

const MOCK_ARTICLES = [
  { slug: "samson-serie-3730-novy-pozicioner", title: "SAMSON s\u00e9rie 3730 \u2014 nov\u00fd inteligentn\u00ed pozicion\u00e9r", perex: "P\u0159edstavujeme novou generaci elektropneumatick\u00fdch pozicion\u00e9r\u016f SAMSON \u0159ady 3730 s integrovanou diagnostikou a komunikac\u00ed HART 7.", content: "<p>Nov\u00e1 \u0159ada pozicion\u00e9r\u016f SAMSON 3730 p\u0159in\u00e1\u0161\u00ed zcela p\u0159epracovan\u00fd firmware s roz\u0161\u00ed\u0159enou diagnostikou. Integrovan\u00fd HART 7 modem umo\u017e\u0148uje vzd\u00e1lenou parametrizaci a monitoring stavu ventilu v re\u00e1ln\u00e9m \u010dase.</p><p>Kl\u00ed\u010dov\u00e9 vlastnosti: automatick\u00e1 kalibrace, diagnostika t\u011bsnosti, sledov\u00e1n\u00ed opot\u0159eben\u00ed ucp\u00e1vky, histogramy provozn\u00edch dat.</p>", category: "produkt", date: "2024-11-15T00:00:00Z", author: "Ing. Jan Nov\u00e1k", imageUrl: null },
  { slug: "modernizace-teplarny-brno-2024", title: "\u00dasp\u011b\u0161n\u00e1 modernizace p\u0159ed\u00e1vac\u00edch stanic v Brn\u011b", perex: "Dokon\u010dili jsme rozs\u00e1hlou modernizaci 12 p\u0159ed\u00e1vac\u00edch stanic pro Tepl\u00e1rny Brno.", content: "<p>V pr\u016fb\u011bhu letn\u00ed odst\u00e1vky 2024 jsme \u00fasp\u011b\u0161n\u011b dokon\u010dili modernizaci 12 p\u0159ed\u00e1vac\u00edch stanic centr\u00e1ln\u00edho z\u00e1sobov\u00e1n\u00ed teplem v Brn\u011b. Projekt zahrnoval v\u00fdm\u011bnu regula\u010dn\u00edch ventil\u016f SAMSON s\u00e9rie 3241 a instalaci nov\u00fdch elektropneumatick\u00fdch pozicion\u00e9r\u016f.</p>", category: "novinka", date: "2024-10-22T00:00:00Z", author: "Ing. Petr Dlouh\u00fd", imageUrl: null },
  { slug: "regulace-pary-vysoke-parametry", title: "Regulace p\u00e1ry p\u0159i vysok\u00fdch parametrech \u2014 technick\u00fd p\u0159ehled", perex: "Technick\u00fd \u010dl\u00e1nek o specifik\u00e1ch regulace p\u00e1ry p\u0159i tlac\u00edch nad 40 bar a teplot\u00e1ch p\u0159esahuj\u00edc\u00edch 400 \u00b0C.", content: "<p>Regulace p\u00e1ry p\u0159i vysok\u00fdch parametrech klade specifick\u00e9 n\u00e1roky na materi\u00e1ly a konstrukci regula\u010dn\u00edch ventil\u016f. Tento \u010dl\u00e1nek shrnuje kl\u00ed\u010dov\u00e9 aspekty v\u00fdb\u011bru ventil\u016f pro aplikace s tlakem nad 40 bar a teplotou nad 400 \u00b0C.</p><p>T\u00e9mata: v\u00fdb\u011br materi\u00e1l\u016f (1.4903, 1.4922), t\u011bsn\u00edc\u00ed syst\u00e9my, kavitace a flash, dimenzov\u00e1n\u00ed Kv hodnoty.</p>", category: "technika", date: "2024-09-10T00:00:00Z", author: "Ing. Martin Kol\u00e1\u0159", imageUrl: null },
  { slug: "elco-nextron-2025", title: "ELCO NEXTRON \u2014 nov\u00e1 \u0159ada kondenza\u010dn\u00edch ho\u0159\u00e1k\u016f", perex: "ELCO uv\u00e1d\u00ed na trh ho\u0159\u00e1ky NEXTRON s \u00fa\u010dinnost\u00ed p\u0159es 98 % a ultra-n\u00edzk\u00fdmi emisemi NOx pod 30 mg/kWh.", content: "<p>Nov\u00e1 \u0159ada ho\u0159\u00e1k\u016f ELCO NEXTRON p\u0159edstavuje \u0161pi\u010dku v oblasti kondenza\u010dn\u00ed techniky. Modula\u010dn\u00ed rozsah 1:10 a ultra-n\u00edzk\u00e9 emise NOx pod 30 mg/kWh p\u0159edur\u010duj\u00ed tyto ho\u0159\u00e1ky pro nejn\u00e1ro\u010dn\u011bj\u0161\u00ed aplikace.</p>", category: "produkt", date: "2024-08-05T00:00:00Z", author: "Ing. Jan Nov\u00e1k", imageUrl: null },
  { slug: "den-otevrenych-dveri-2024", title: "Den otev\u0159en\u00fdch dve\u0159\u00ed \u2014 15. listopadu 2024", perex: "Zveme V\u00e1s na den otev\u0159en\u00fdch dve\u0159\u00ed v na\u0161\u00ed servisn\u00ed d\u00edln\u011b v Brn\u011b.", content: "<p>Srde\u010dn\u011b V\u00e1s zveme na den otev\u0159en\u00fdch dve\u0159\u00ed v na\u0161\u00ed servisn\u00ed d\u00edln\u011b na adrese Ka\u0161tanov\u00e1 489/34, Brno. Program zahrnuje uk\u00e1zky oprav a reviz\u00ed regula\u010dn\u00edch ventil\u016f, p\u0159edn\u00e1\u0161ky o prediktivn\u00ed diagnostice a neform\u00e1ln\u00ed setk\u00e1n\u00ed s na\u0161imi techniky.</p><p>Datum: 15. listopadu 2024, 9:00\u201316:00. Vstup zdarma, registrace na info@dlouhy-technology.cz.</p>", category: "akce", date: "2024-07-20T00:00:00Z", author: null, imageUrl: null },
]

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = MOCK_ARTICLES.find((a) => a.slug === slug)
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
  const article = MOCK_ARTICLES.find((a) => a.slug === slug)
  if (!article) notFound()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">Hlavni stranka</Link>
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
          <span className="text-sm text-neutral-400">{formatDate(article.date)}</span>
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
            &larr; Zp\u011bt na novinky
          </Link>
        </div>
      </article>
    </div>
  )
}
