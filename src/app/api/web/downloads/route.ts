import { db } from "@/lib/db"
import { downloads } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get("category")
  const manufacturer = searchParams.get("manufacturer")

  const conditions = [
    eq(downloads.isPublic, true),
    isNull(downloads.deletedAt),
  ]

  if (category) {
    conditions.push(eq(downloads.category, category))
  }
  if (manufacturer) {
    conditions.push(eq(downloads.manufacturer, manufacturer))
  }

  const results = await db
    .select()
    .from(downloads)
    .where(and(...conditions))
    .orderBy(downloads.sortOrder, downloads.name)

  return Response.json(results)
}
