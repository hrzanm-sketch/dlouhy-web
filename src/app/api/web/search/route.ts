import { db } from "@/lib/db"
import { products, categories } from "@/lib/db/schema"
import { and, eq, isNull, or, ilike } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  const limit = Math.min(
    20,
    Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "10", 10))
  )

  if (!q || q.trim().length < 2) {
    return Response.json({ results: [] })
  }

  const term = `%${q.trim()}%`

  const results = await db
    .select({
      slug: products.slug,
      name: products.name,
      typeCode: products.typeCode,
      manufacturer: products.manufacturer,
      categorySlug: categories.slug,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        isNull(products.deletedAt),
        or(ilike(products.name, term), ilike(products.typeCode, term))
      )
    )
    .limit(limit)

  return Response.json({ results })
}
