import { NextResponse } from "next/server"

const MOCK_ARTICLES = [
  { slug: "samson-serie-3730-novy-pozicioner", title: "SAMSON serie 3730 -- novy inteligentni pozicioner", perex: "Predstavujeme novou generaci elektropneumatickych pozicioneru SAMSON rady 3730.", content: "Nova rada pozicioneru SAMSON 3730 prinasi zcela prepracovany firmware s rozsirenou diagnostikou...", category: "produkt", date: "2024-11-15T00:00:00Z", author: "Ing. Jan Novak", imageUrl: null },
  { slug: "modernizace-teplarny-brno-2024", title: "Uspesna modernizace predavacich stanic v Brne", perex: "Dokoncili jsme rozsahlou modernizaci 12 predavacich stanic pro Teplarny Brno.", content: "V prubehu letni odstavky 2024 jsme uspesne dokoncili modernizaci...", category: "novinka", date: "2024-10-22T00:00:00Z", author: "Ing. Petr Dlouhy", imageUrl: null },
  { slug: "regulace-pary-vysoke-parametry", title: "Regulace pary pri vysokych parametrech", perex: "Technicky clanek o specifikach regulace pary.", content: "Regulace pary pri vysokych parametrech klade specificke naroky...", category: "technika", date: "2024-09-10T00:00:00Z", author: "Ing. Martin Kolar", imageUrl: null },
  { slug: "elco-nextron-2025", title: "ELCO NEXTRON -- nova rada kondenzacnich horaku", perex: "ELCO uvadi na trh horaky NEXTRON.", content: "Nova rada horaku ELCO NEXTRON predstavuje spicku...", category: "produkt", date: "2024-08-05T00:00:00Z", author: "Ing. Jan Novak", imageUrl: null },
  { slug: "den-otevrenych-dveri-2024", title: "Den otevrenych dveri", perex: "Zveme Vas na den otevrenych dveri.", content: "Srdecne Vas zveme na den otevrenych dveri...", category: "akce", date: "2024-07-20T00:00:00Z", author: null, imageUrl: null },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = MOCK_ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return NextResponse.json({ error: "Clanek nenalezen" }, { status: 404 })
  }

  return NextResponse.json(article)
}
