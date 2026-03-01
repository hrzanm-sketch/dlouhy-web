import { db } from "@/lib/db"
import { categories } from "@/lib/db/schema"
import { and, eq, isNull, asc } from "drizzle-orm"

export async function GET() {
  const rows = await db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      description: categories.description,
      image: categories.image,
      parentId: categories.parentId,
      manufacturer: categories.manufacturer,
      sortOrder: categories.sortOrder,
    })
    .from(categories)
    .where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))
    .orderBy(asc(categories.sortOrder), asc(categories.name))

  // Build tree structure
  type CategoryNode = (typeof rows)[number] & { children: CategoryNode[] }
  const map = new Map<string, CategoryNode>()
  const roots: CategoryNode[] = []

  for (const row of rows) {
    map.set(row.id, { ...row, children: [] })
  }

  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return Response.json({ categories: roots })
}
