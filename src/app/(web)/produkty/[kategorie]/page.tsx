import { Suspense } from "react"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { products, categories } from "@/lib/db/schema"
import { and, eq, ilike, isNull, count, asc } from "drizzle-orm"
import { ProductGrid } from "@/components/products/product-grid"
import { FilterSidebar } from "@/components/products/filter-sidebar"
import { Pagination } from "@/components/ui/pagination"
import type { Metadata } from "next"
import Link from "next/link"

export const revalidate = 3600

const LIMIT = 12

export async function generateStaticParams() {
  try {
    const cats = await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(and(eq(categories.isActive, true), isNull(categories.deletedAt)))

    return cats.map((c) => ({ kategorie: c.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategorie: string }>
}): Promise<Metadata> {
  const { kategorie } = await params
  const cat = await db
    .select({ name: categories.name, description: categories.description })
    .from(categories)
    .where(
      and(
        eq(categories.slug, kategorie),
        eq(categories.isActive, true),
        isNull(categories.deletedAt)
      )
    )
    .limit(1)

  if (!cat[0]) return { title: "Kategorie | Dlouhy Technology" }

  return {
    title: `${cat[0].name} | Produkty | Dlouhy Technology`,
    description: cat[0].description || `Produkty v kategorii ${cat[0].name}.`,
  }
}

async function getCategoryProducts(
  categorySlug: string,
  params: { manufacturer?: string; search?: string; page: number }
) {
  const conditions = [
    eq(products.isActive, true),
    isNull(products.deletedAt),
    eq(categories.slug, categorySlug),
  ]

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

export default async function KategoriePage({
  params,
  searchParams,
}: {
  params: Promise<{ kategorie: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { kategorie } = await params
  const sp = await searchParams

  // Fetch category info
  const cat = await db
    .select({
      name: categories.name,
      description: categories.description,
    })
    .from(categories)
    .where(
      and(
        eq(categories.slug, kategorie),
        eq(categories.isActive, true),
        isNull(categories.deletedAt)
      )
    )
    .limit(1)

  if (!cat[0]) notFound()

  const manufacturer = typeof sp.manufacturer === "string" ? sp.manufacturer : undefined
  const search = typeof sp.search === "string" ? sp.search : undefined
  const page = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10))

  const data = await getCategoryProducts(kategorie, { manufacturer, search, page })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-dt-blue">
          Hlavni stranka
        </Link>
        <span className="mx-2">/</span>
        <Link href="/produkty" className="hover:text-dt-blue">
          Produkty
        </Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{cat[0].name}</span>
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">{cat[0].name}</h1>
        {cat[0].description && (
          <p className="mt-2 max-w-3xl text-neutral-600">{cat[0].description}</p>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar — manufacturer only */}
        <div className="w-full shrink-0 lg:w-60">
          <Suspense>
            <FilterSidebar showCategoryFilter={false} />
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
