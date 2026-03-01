import { NextResponse } from "next/server"

const MOCK_REFERENCES = [
  { slug: "teplarna-brno", customer: "Teplárny Brno a.s.", industry: "teplarenstvi", excerpt: "Dodávka a montáž 12 regulačních ventilů SAMSON série 3241 pro modernizaci předávacích stanic.", content: "Teplárny Brno provozují rozsáhlou síť centrálního zásobování teplem...", year: 2024, imageUrl: null },
  { slug: "cez-elektrarna-tusimice", customer: "ČEZ a.s. — Elektrárna Tušimice", industry: "energetika", excerpt: "Kompletní výměna recirkulačních ventilů SCHROEDAHL na bloků 22 a 23.", content: "V rámci plánované odstávky bloků 22 a 23...", year: 2024, imageUrl: null },
  { slug: "unipetrol-litvinov", customer: "ORLEN Unipetrol RPA s.r.o.", industry: "chemie", excerpt: "Servis a revize 45 regulačních armatur v provozu ethylénové jednotky.", content: "Pro ORLEN Unipetrol jsme zajistili pravidelný servis...", year: 2023, imageUrl: null },
  { slug: "skoda-auto-mlada-boleslav", customer: "ŠKODA AUTO a.s.", industry: "prumysl", excerpt: "Instalace hořáků ELCO pro novou lakovací linku — 8 jednotek s řízením emisí.", content: "Pro novou lakovací linku v závodě Mladá Boleslav...", year: 2023, imageUrl: null },
  { slug: "veolia-olomouc", customer: "Veolia Energie ČR a.s.", industry: "teplarenstvi", excerpt: "Dodávka ventilů SAMSON typ 3321 pro regulaci páry v teplárně Olomouc.", content: "Pro Veolia Energie jsme dodali sadu regulačních ventilů...", year: 2022, imageUrl: null },
]

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const ref = MOCK_REFERENCES.find((r) => r.slug === slug)

  if (!ref) {
    return NextResponse.json({ error: "Reference nenalezena" }, { status: 404 })
  }

  return NextResponse.json(ref)
}
