import { Suspense } from "react"
import { db } from "@/lib/db"
import { products, categories } from "@/lib/db/schema"
import { and, eq, ilike, isNull, count, asc } from "drizzle-orm"
import { ProductGrid } from "@/components/products/product-grid"
import { FilterSidebar } from "@/components/products/filter-sidebar"
import { Pagination } from "@/components/ui/pagination"
import type { Metadata } from "next"
import Link from "next/link"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Produkty | Dlouhy Technology",
  description:
    "Regulacni ventily SAMSON, recirkulacni ventily SCHROEDAHL/CIRCOR, horaky ELCO. Kompletni nabidka produktu Dlouhy Technology.",
}

const LIMIT = 12

async function getCategories() {
  return db
    .select({ slug: categories.slug, name: categories.name })
    .from(categories)
    .where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))
    .orderBy(asc(categories.sortOrder), asc(categories.name))
}

async function getProducts(params: {
  category?: string
  manufacturer?: string
  search?: string
  page: number
}) {
  const conditions = [
    eq(products.isActive, true),
    isNull(products.deletedAt),
  ]

  if (params.category) {
    conditions.push(eq(categories.slug, params.category))
  }

  if (params.manufacturer) {
    conditions.push(eq(products.manufacturer, params.manufacturer))
  }

  if (params.search) {
    conditions.push(ilike(products.name, `%${params.search}%`))
  }

  const where = and(...conditions)
  const offset = (params.page - 1) * LIMIT

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
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(asc(products.sortOrder), asc(products.name))
      .limit(LIMIT)
      .offset(offset),
    db
      .select({ total: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
  ])

  return {
    products: rows,
    total: totalResult[0]?.total ?? 0,
    totalPages: Math.ceil((totalResult[0]?.total ?? 0) / LIMIT),
  }
}

export default async function ProduktyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const category = typeof params.category === "string" ? params.category : undefined
  const manufacturer = typeof params.manufacturer === "string" ? params.manufacturer : undefined
  const search = typeof params.search === "string" ? params.search : undefined
  const page = Math.max(1, parseInt(typeof params.page === "string" ? params.page : "1", 10))

  const [cats, data] = await Promise.all([
    getCategories(),
    getProducts({ category, manufacturer, search, page }),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">Produkty</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-neutral-900">Produkty</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 lg:w-60">
          <Suspense>
            <FilterSidebar categories={cats} showCategoryFilter />
          </Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <ProductGrid products={data.products} />
          {data.totalPages > 1 && (
            <div className="mt-8">
              <Suspense>
                <Pagination currentPage={page} totalPages={data.totalPages} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
