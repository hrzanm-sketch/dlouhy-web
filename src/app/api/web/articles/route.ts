import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MOCK_ARTICLES = [
  { id: "1", slug: "samson-serie-3730-novy-pozicioner", title: "SAMSON serie 3730 -- novy inteligentni pozicioner", perex: "Predstavujeme novou generaci elektropneumatickych pozicioneru SAMSON rady 3730 s integrovanou diagnostikou a komunikaci HART 7.", category: "produkt", date: "2024-11-15T00:00:00Z", imageUrl: null },
  { id: "2", slug: "modernizace-teplarny-brno-2024", title: "Uspesna modernizace predavacich stanic v Brne", perex: "Dokoncili jsme rozsahlou modernizaci 12 predavacich stanic pro Teplarny Brno.", category: "novinka", date: "2024-10-22T00:00:00Z", imageUrl: null },
  { id: "3", slug: "regulace-pary-vysoke-parametry", title: "Regulace pary pri vysokych parametrech -- technicky prehled", perex: "Technicky clanek o specifikach regulace pary pri tlacich nad 40 bar a teplotach presahujicich 400 °C.", category: "technika", date: "2024-09-10T00:00:00Z", imageUrl: null },
  { id: "4", slug: "elco-nextron-2025", title: "ELCO NEXTRON -- nova rada kondenzacnich horaku", perex: "ELCO uvadi na trh horaky NEXTRON s ucinnosti pres 98 % a ultra-nizkymi emisemi NOx pod 30 mg/kWh.", category: "produkt", date: "2024-08-05T00:00:00Z", imageUrl: null },
  { id: "5", slug: "den-otevrenych-dveri-2024", title: "Den otevrenych dveri -- 15. listopadu 2024", perex: "Zveme Vas na den otevrenych dveri v nasi servisni dilne v Brne.", category: "akce", date: "2024-07-20T00:00:00Z", imageUrl: null },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get("category")
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)))

  let filtered = [...MOCK_ARTICLES]

  if (category) {
    filtered = filtered.filter((a) => a.category === category)
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const articles = filtered.slice((page - 1) * limit, page * limit)

  return NextResponse.json({ articles, total, page, totalPages })
}
