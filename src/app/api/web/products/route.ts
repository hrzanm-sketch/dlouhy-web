import { db } from "@/lib/db"
import { products, categories } from "@/lib/db/schema"
import { and, eq, ilike, isNull, sql, count } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get("category")
  const manufacturer = searchParams.get("manufacturer")
  const search = searchParams.get("search")
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)))
  const offset = (page - 1) * limit

  const conditions = [
    eq(products.isActive, true),
    isNull(products.deletedAt),
  ]

  if (category) {
    conditions.push(eq(categories.slug, category))
  }

  if (manufacturer) {
    conditions.push(eq(products.manufacturer, manufacturer))
  }

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`))
  }

  const where = and(...conditions)

  const [rows, totalResult] = await Promise.all([
    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        typeCode: products.typeCode,
        manufacturer: products.manufacturer,
        shortDescription: products.shortDescription,
        mainImage: products.mainImage,
        categorySlug: categories.slug,
        categoryName: categories.name,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(products.sortOrder, products.name)
      .limit(limit)
      .offset(offset),
    db
      .select({ total: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
  ])

  const total = totalResult[0]?.total ?? 0

  return Response.json({
    products: rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
