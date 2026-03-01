import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const MOCK_REFERENCES = [
  { id: "1", slug: "teplarna-brno", customer: "Teplárny Brno a.s.", industry: "teplarenstvi", excerpt: "Dodávka a montáž 12 regulačních ventilů SAMSON série 3241 pro modernizaci předávacích stanic.", year: 2024, imageUrl: null },
  { id: "2", slug: "cez-elektrarna-tusimice", customer: "ČEZ a.s. — Elektrárna Tušimice", industry: "energetika", excerpt: "Kompletní výměna recirkulačních ventilů SCHROEDAHL na bloků 22 a 23.", year: 2024, imageUrl: null },
  { id: "3", slug: "unipetrol-litvinov", customer: "ORLEN Unipetrol RPA s.r.o.", industry: "chemie", excerpt: "Servis a revize 45 regulačních armatur v provozu ethylénové jednotky.", year: 2023, imageUrl: null },
  { id: "4", slug: "skoda-auto-mlada-boleslav", customer: "ŠKODA AUTO a.s.", industry: "prumysl", excerpt: "Instalace hořáků ELCO pro novou lakovací linku — 8 jednotek s řízením emisí.", year: 2023, imageUrl: null },
  { id: "5", slug: "veolia-olomouc", customer: "Veolia Energie ČR a.s.", industry: "teplarenstvi", excerpt: "Dodávka ventilů SAMSON typ 3321 pro regulaci páry v teplárně Olomouc.", year: 2022, imageUrl: null },
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const industry = searchParams.get("industry")
  const yearParam = searchParams.get("year")
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)))

  let filtered = [...MOCK_REFERENCES]

  if (industry) {
    filtered = filtered.filter((r) => r.industry === industry)
  }

  if (yearParam) {
    const year = parseInt(yearParam, 10)
    if (!isNaN(year)) {
      filtered = filtered.filter((r) => r.year === year)
    }
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const references = filtered.slice((page - 1) * limit, page * limit)

  return NextResponse.json({ references, total, page, totalPages })
}
